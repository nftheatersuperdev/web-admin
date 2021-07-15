#!/bin/bash

ZIP_FILE_NAME="evme-webadmin-$VERSION.zip"

cd $STATIC_WEB_FOLDER
zip -r $ZIP_FILE_NAME .
aws s3 cp $ZIP_FILE_NAME $S3_URI/$ZIP_FILE_NAME
aws amplify create-branch \
    --app-id $AMPLIFY_APP_ID \
    --branch-name $AMPLIFY_BRANCH_NAME || true
aws amplify start-deployment \
    --app-id $AMPLIFY_APP_ID \
    --branch-name $AMPLIFY_BRANCH_NAME \
    --source-url="$S3_URI/$ZIP_FILE_NAME"
