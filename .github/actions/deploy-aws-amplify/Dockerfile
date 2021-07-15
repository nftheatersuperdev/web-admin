FROM amazon/aws-cli:2.0.6

ENV AWS_DEFAULT_REGION="ap-southeast-1"
ENV AWS_ACCESS_KEY_ID=""
ENV AWS_SECRET_ACCESS_KEY=""
ENV VERSION=""
ENV S3_URI=""
ENV AMPLIFY_APP_ID=""
ENV AMPLIFY_BRANCH_NAME=""
ENV STATIC_WEB_FOLDER=""

# Prepare tools
RUN yum install -y zip
RUN mkdir /deployment
COPY ./entrypoint.sh /deployment/entrypoint.sh
RUN chmod +x /deployment/entrypoint.sh

# Zip, upload and deploy
ENTRYPOINT ["sh", "-c", "/deployment/entrypoint.sh"]
