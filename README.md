# Getting started

1. Clone the repo (get credentials from IAM) or go to 1.a
```
git clone https://yourRepoURL
```

a. Initialize a new repo, go to step 3
```
mkdir yourRepo
cd yourRepo
git init
```

2. Switch to project directory
```
cd yourRepo
```

3. Make sure your git user name and email are correct
```
>git config user.name && git config user.email
deegles
diego@vokkal.co
```

4. Make sure npm and node are installed
```
> node -v && npm -v
  v6.9.5
  3.10.10
```

5. Install dependencies
```
npm install
npm install -g webpack
```

6. Set up an AWS profile (make sure the AWS CLI is installed)
```
aws configure --profile cookietime
```

7. Run the build
```
npm run build
```

8. Deploy to AWS
```
npm run deploy
```