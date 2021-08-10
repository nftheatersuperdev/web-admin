#!/bin/bash

ZIP_FILE_NAME="evme-webadmin-$VERSION.zip"
EXISTING_BRANCH=$(AWS_PAGER="" aws amplify get-branch --app-id dtp5j1r0e5pwz --branch-name $AMPLIFY_BRANCH_NAME | jq -r ".branch.branchName")

cd $STATIC_WEB_FOLDER
zip -r $ZIP_FILE_NAME .
aws s3 cp $ZIP_FILE_NAME $S3_URI/$ZIP_FILE_NAME

if [[ $EXISTING_BRANCH == "" ]]
then
  echo "Branch does not exist, Creating a new amplify branch...";
  aws amplify create-branch \
      --app-id $AMPLIFY_APP_ID \
      --branch-name $AMPLIFY_BRANCH_NAME || true
else
  echo "Branch named $AMPLIFY_BRANCH_NAME already exists!"
fi

aws amplify start-deployment \
    --app-id $AMPLIFY_APP_ID \
    --branch-name $AMPLIFY_BRANCH_NAME \
    --source-url="$S3_URI/$ZIP_FILE_NAME"
