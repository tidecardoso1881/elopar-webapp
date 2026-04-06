#!/usr/bin/env bash
# Lista todos os campos e opções do projeto #4
OWNER="tidecardoso1881"
PROJECT_NUMBER=4

gh api graphql -f query='
  query($owner: String!, $number: Int!) {
    user(login: $owner) {
      projectV2(number: $number) {
        title
        fields(first: 30) {
          nodes {
            ... on ProjectV2SingleSelectField {
              name
              options { id name }
            }
            ... on ProjectV2Field {
              name
            }
          }
        }
      }
    }
  }' -f owner="$OWNER" -F number=$PROJECT_NUMBER \
  --jq '.data.user.projectV2 | "Projeto: \(.title)", (.fields.nodes[] | select(.name != null) | "Campo: \(.name)", (.options[]? | "  Opção: [\(.id)] \(.name)"))'
