#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Configurações rápidas (pode sobrescrever via argumentos):
#   1) Repositório (owner/name)
#   2) Nome do workflow (.yml)
#   3) Branch de execução (ref)
#   4) Node version (input do workflow)
#   5) Timeout total em segundos para aguardar conclusão
# ============================================================

REPO="${1:-cristoffer4-arch/app-imobiliario-plus}"
WORKFLOW_FILE="${2:-fix-project.yml}"
REF_BRANCH="${3:-fix/auto-refactor}"
NODE_VERSION_INPUT="${4:-20.x}"
TIMEOUT_SECS="${5:-900}"  # 15 minutos

if [[ -z "${GH_PAT:-}" ]]; then
  echo "ERRO: variável GH_PAT não definida. Exporte seu token PAT:"
  echo '  export GH_PAT="seu_token_aqui"'
  exit 1
fi

api() {
  # Uso: api METHOD URL [DATA_JSON]
  local method="$1"
  local url="$2"
  local data="${3:-}"

  if [[ -n "$data" ]]; then
    curl -sS -X "$method" \
      -H "Accept: application/vnd.github+json" \
      -H "Authorization: Bearer $GH_PAT" \
      -H "Content-Type: application/json" \
      "$url" \
      -d "$data"
  else
    curl -sS -X "$method" \
      -H "Accept: application/vnd.github+json" \
      -H "Authorization: Bearer $GH_PAT" \
      "$url"
  fi
}

echo "==> Verificando se o workflow '${WORKFLOW_FILE}' existe no repositório ${REPO}…"
WF_LIST_JSON="$(api GET "https://api.github.com/repos/${REPO}/actions/workflows")" || {
  echo "ERRO: não foi possível listar workflows. Verifique REPO e permissões do token."
  exit 1
}

WF_ID="$(echo "$WF_LIST_JSON" | jq -r --arg wf "$WORKFLOW_FILE" '.workflows[] | select(.path | endswith($wf)) | .id' || true)"
if [[ -z "$WF_ID" || "$WF_ID" == "null" ]]; then
  echo "ERRO: workflow '${WORKFLOW_FILE}' não encontrado em ${REPO}."
  echo "Dica: confirme que o arquivo existe em .github/workflows/${WORKFLOW_FILE} no branch ${REF_BRANCH}."
  exit 1
fi
echo "   ✓ Workflow encontrado (id=${WF_ID})."
echo "==> Disparando workflow_dispatch no branch '${REF_BRANCH}'…"
DISPATCH_PAYLOAD="$(jq -n --arg ref "$REF_BRANCH" --arg node "$NODE_VERSION_INPUT" '{ref: $ref, inputs: {node_version: $node}}')"
api POST "https://api.github.com/repos/${REPO}/actions/workflows/${WF_ID}/dispatches" "$DISPATCH_PAYLOAD" >/dev/null
echo "   ✓ Dispatch enviado."
echo "==> Aguardando run criado para este workflow (event=workflow_dispatch, branch=${REF_BRANCH})…"
START_TS="$(date +%s)"
RUN_ID=""
RUN_HTML_URL=""

# Primeiro polling: obter o run mais recente do workflow_dispatch nesse branch
while :; do
  NOW_TS="$(date +%s)"
  ELAPSED=$((NOW_TS - START_TS))
  if (( ELAPSED > TIMEOUT_SECS )); then
    echo "ERRO: timeout aguardando o run ser criado."
    exit 1
  fi

  # Busca últimos runs do repositório filtrando por evento e branch
  RUNS_JSON="$(api GET "https://api.github.com/repos/${REPO}/actions/runs?event=workflow_dispatch&branch=${REF_BRANCH}")"
  # Seleciona o run mais novo que referencie este workflow id
  RUN_ID="$(echo "$RUNS_JSON" | jq -r --arg id "$WF_ID" '.workflow_runs | map(select(.workflow_id | tostring == $id)) | sort_by(.created_at) | last | .id' 2>/dev/null || true)"
  RUN_HTML_URL="$(echo "$RUNS_JSON" | jq -r --arg id "$WF_ID" '.workflow_runs | map(select(.workflow_id | tostring == $id)) | sort_by(.created_at) | last | .html_url' 2>/dev/null || true)"

  if [[ -n "$RUN_ID" && "$RUN_ID" != "null" ]]; then
    echo "   ✓ Run encontrado: id=${RUN_ID}"
    echo "   • URL do run: ${RUN_HTML_URL}"
    break
  fi

  sleep 3
done
echo "==> Aguardando conclusão do run (status/conclusion)…"
CONCLUSION=""
STATUS=""

while :; do
  NOW_TS="$(date +%s)"
  ELAPSED=$((NOW_TS - START_TS))
  if (( ELAPSED > TIMEOUT_SECS )); then
    echo "ERRO: timeout aguardando conclusão do run."
    echo "     Consulte manualmente: ${RUN_HTML_URL}"
    exit 1
  fi

  RUN_JSON="$(api GET "https://api.github.com/repos/${REPO}/actions/runs/${RUN_ID}")"
  STATUS="$(echo "$RUN_JSON" | jq -r '.status')"
  CONCLUSION="$(echo "$RUN_JSON" | jq -r '.conclusion')"

  printf "   • status=%s, conclusion=%s\r" "$STATUS" "$CONCLUSION"

  # status: queued|in_progress|completed
  if [[ "$STATUS" == "completed" ]]; then
    echo
    echo "   ✓ Run concluído: conclusion=${CONCLUSION}"
    break
  fi

  sleep 5
done
echo "==> Resultado final:"
echo "   • Run URL:  ${RUN_HTML_URL}"
echo "   • Status:   ${STATUS}"
echo "   • Conclusion: ${CONCLUSION}"

# Artefatos / logs (opcional)
echo "==> (Opcional) Listando artefatos deste run…"
ARTIFACTS_JSON="$(api GET "https://api.github.com/repos/${REPO}/actions/runs/${RUN_ID}/artifacts")" || true
ART_COUNT="$(echo "$ARTIFACTS_JSON" | jq -r '.total_count' 2>/dev/null || echo "0")"
echo "   • Artefatos: ${ART_COUNT}"
if [[ "${ART_COUNT}" -gt 0 ]]; then
  echo "$ARTIFACTS_JSON" | jq -r '.artifacts[] | "\(.name) — \(.archive_download_url)"'
fi
echo "==> Fim.
