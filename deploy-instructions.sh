#!/bin/bash

echo "=== Firebase Functions デプロイ手順 ==="
echo ""
echo "ステップ1: Firebase Functions環境変数の設定"
echo "----------------------------------------"
echo "以下のコマンドを実行してください（実際の値に置き換えてください）："
echo ""
echo 'npx firebase-tools functions:config:set \'
echo '  line.channel_id="YOUR_CHANNEL_ID" \'
echo '  line.channel_secret="YOUR_CHANNEL_SECRET" \'
echo '  line.channel_access_token="YOUR_CHANNEL_ACCESS_TOKEN"'
echo ""
echo "設定確認："
echo "npx firebase-tools functions:config:get"
echo ""
echo ""
echo "ステップ2: Firestoreルールのデプロイ"
echo "----------------------------------------"
echo "npx firebase-tools deploy --only firestore:rules"
echo ""
echo ""
echo "ステップ3: Cloud Functionsのデプロイ"
echo "----------------------------------------"
echo "npx firebase-tools deploy --only functions"
echo ""
echo "デプロイ後、lineWebhookのURLをコピーしてください"
echo ""
