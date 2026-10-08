
pipeline {
    agent any

    stages {

        // 1. Test du pipeline
        stage('Test Pipeline') {
            steps {
                echo 'SecureTask DevSecOps Pipeline'
            }
        }

        // 2. Détection des secrets avec Gitleaks
        stage('secrets_scan') {
            steps {
                bat '"C:\\Users\\telli\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gitleaks.Gitleaks_Microsoft.Winget.Source_8wekyb3d8bbwe\\gitleaks.exe" git . --redact'
            }
        }

        // 3. SAST avec SonarQube
        stage('sast') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarScanner'

                        bat "\"${scannerHome}\\bin\\sonar-scanner.bat\" -Dsonar.projectKey=SecureTask -Dsonar.sources=src,backend"
                    }
                }
            }
        }

        // 4. Quality Gate SonarQube
        stage('quality_gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // 5. SCA - Scan des dépendances avec Trivy
        stage('scan_dependencies') {
            steps {
                bat '"C:\\Users\\telli\\AppData\\Local\\Microsoft\\WinGet\\Links\\trivy.exe" fs --skip-db-update --severity HIGH,CRITICAL --exit-code 1 .'
            }
        }

        // 6. Construction de l'image Docker
        stage('docker_build') {
            steps {
                bat 'docker build -t securetask-backend ./backend'
            }
        }

        // 7. Scan de l'image Docker avec Trivy
        stage('docker_scan') {
            steps {
                bat '"C:\\Users\\telli\\AppData\\Local\\Microsoft\\WinGet\\Links\\trivy.exe" image --skip-db-update --severity HIGH,CRITICAL --exit-code 1 securetask-backend'
            }
        }

        // 8. DAST avec OWASP ZAP
        stage('dast') {
            steps {
                bat 'docker run --rm -t -v "%CD%:/zap/wrk/:rw" ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:3000 -r zap-report.html -J zap-report.json -I'
            }
        }
    }

    // Notifications Gmail
    post {
        success {
            echo 'Pipeline DevSecOps SecureTask termine avec succes.'

            mail to: 'wejdantelli07@gmail.com',
                 subject: "SUCCESS - SecureTask Build #${BUILD_NUMBER}",
                 body: "Le pipeline DevSecOps SecureTask a reussi.\nBuild : ${BUILD_NUMBER}\nJenkins : ${BUILD_URL}"
        }

        failure {
            echo 'Pipeline bloque : un controle de securite a echoue.'

            mail to: 'wejdantelli07@gmail.com',
                 subject: "FAILED - SecureTask Build #${BUILD_NUMBER}",
                 body: "Le pipeline SecureTask a echoue.\nBuild : ${BUILD_NUMBER}\nJenkins : ${BUILD_URL}"
        }
    }
}
