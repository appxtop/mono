# mono
这是一个模板项目

这是一个由pnpm管理的monorepo项目

包含vue3+ts+less+elementpuls的web-client

包含express(不重要) + socket.io的backend



## 数据库
该项目使用 mongodb 加 redis 数据库

## 使用方法
```
//git clone 
//cd
//安装依赖
npm install
//复制环境变量配置文件并修改其中的数据库连接
//cp .env.example .env
//初始化数据库在packages/launcher中,执行其中的方法就行了
//前端服务器
npm run dev:backend
//前端静态页面
npm run dev:client-web
```

## 等待解决问题

bug:修改邮箱没有验证验证码

feat:忘记密码功能