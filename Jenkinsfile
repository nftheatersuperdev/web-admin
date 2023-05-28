@Library('shared-jenkins-library@master') _

pipeline {
    agent { label "master" }
    tools { nodejs 'NodeJS' }

    parameters {
        string(name: 'APP_NAME', defaultValue: 'web-admin', description: 'You Application Name')
    }

    stages {
        stage ('Get Latest Version') {
            steps {
                script {
                    latestTag = sh(returnStdout:  true, script: "git tag --sort=-creatordate | head -n 1").trim()
                    env.APP_VERSION = latestTag + "-" + currentBuild.number
                }
            }
        }
        stage ('Install Package') {
            steps {
                sh 'npm install'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                 withSonarQubeEnv('sonarqube') {
                    sonarqubeWebAnalysis(params.APP_NAME, params.ENVIRONMENT)
                }
            }
        }
        stage("Quality Gate") {
            steps {
                // timeout(time: 300, unit: 'SECONDS') {
                //     waitForQualityGate abortPipeline: true
                // }
                sh 'echo "Quality Gate: Now always passed."'
            }
        }
        stage ('Build And Push Bundle To S3') {
            steps {
                script {
                    webBuildAndPushS3(
                        env.APP_VERSION,
                        params.ENVIRONMENT
                    )
                }
            }
        }
        stage ('Deploy') {
            steps {
                script {
                    webDeploy(
                        params.AMPLIFY_APP_ID,
                        env.APP_VERSION,
                        params.ENVIRONMENT
                    )
                }
            }
        }
    }

    post {
        always {
            script {
                sendNotifications(currentBuild.result)
            }
        }
    }
}