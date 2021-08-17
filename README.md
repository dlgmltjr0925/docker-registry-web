# Docker Registry Web [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/main/LICENSE) 

## Docker Registry Web은 docker registry 관리 툴
<img width="800" src="https://github.com/dlgmltjr0925/docker-registry-web/blob/master/docs/sample.gif?raw=true"/>

## 주요 기능
- Docker registry 통합 관리
- 쉬운 등록 및 삭제
- Docker registry에 저장되어 있는 이미지 목록 조회
- 이미지별 태그 목록 조회
- Docker registry 태그 삭제 기능 활성시 쉬운 삭제 기능 
## 사용방법
### 빌드 및 실행
```bash
git clone https://github.com/dlgmltjr0925/docker-registry-web
cd docker-registry-web

yarn && yarn build
yarn start
```

### Docker Container
```bash
docker run -d -p 3000:3000 --name docker-registry-web dlgmltjr0925/docker-registry-web:latest
```

### Kubernetes deployment 
```bash
kubectl apply -f https://raw.githubusercontent.com/dlgmltjr0925/docker-registry-web/master/kubernetes-deployment.yaml
```

## Notice
  - 기능 개선을 위해 신규 프로젝트([Docker-registry-folder](https://github.com/dlgmltjr0925/docker-registry-folder))로 재개발중