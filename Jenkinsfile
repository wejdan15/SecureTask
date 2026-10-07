pipeline {
    agent any

    stages {

        stage('Test Pipeline') {
            steps {
                echo 'SecureTask DevSecOps Pipeline'
            }
        }

        // 1. Détection des secrets
        stage('secrets_scan') {
            steps {
                bat '"C:\\Users\\telli\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gitleaks.Gitleaks_Microsoft.Winget.Source_8wekyb3d8bbwe\\gitleaks.exe" git . --redact'
            }
        }

        // 2. SAST avec SonarQube
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

        // 3. Quality Gate SonarQube
        stage('quality_gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // 4. SCA : vulnérabilités des dépendances
        stage('scan_dependencies') {
            steps {
                bat '"C:\\Users\\telli\\AppData\\Local\\Microsoft\\WinGet\\Links\\trivy.exe" fs --severity HIGH,CRITICAL --exit-code 1 .'
            }
        }

        // 5. Construction de l'image Docker
        stage('docker_build') {
            steps {
                bat 'docker build -t securetask-backend ./backend'
            }
        }

        // 6. Scan de sécurité de l'image Docker
        stage('docker_scan') {
            steps {
                bat '"C:\\Users\\telli\\AppData\\Local\\Microsoft\\WinGet\\Links\\trivy.exe" image --severity HIGH,CRITICAL --exit-code 1 securetask-backend'
            }
        }
// 7. DAST avec OWASP ZAP + rapports
stage('dast') {
    steps {
        bat 'docker run --rm -t -v "%CD%:/zap/wrk/:rw" ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:3000 -r zap-report.html -J zap-report.json -I'
    }
}
    }

    post {
        success {
            echo 'Pipeline DevSecOps SecureTask terminé avec succès.'
        }

        failure {
            echo 'Pipeline bloqué : un contrôle de sécurité a échoué.'
        }
    }
}