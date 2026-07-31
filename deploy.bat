@echo off
chcp 65001 >nul
echo ====================================
echo 督察APP 快速部署到 GitHub Pages
echo ====================================
echo.

REM 检查 Git 是否安装
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到 Git，请先安装 Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/6] 初始化 Git 仓库...
cd /d "%~dp0"
if not exist ".git" (
    git init
    echo Git 仓库初始化完成
) else (
    echo Git 仓库已存在
)

echo.
echo [2/6] 添加所有文件到暂存区...
git add .

echo.
echo [3/6] 创建提交...
git commit -m "feat: 督察APP高保真原型 - 初始提交"

echo.
echo [4/6] 设置分支为 main...
git branch -M main

echo.
echo ====================================
echo 接下来需要您完成以下步骤：
echo ====================================
echo.
echo 1. 在浏览器中打开 https://github.com/new
echo 2. 创建新仓库（例如：supervision-app-prototype）
echo 3. 仓库设为 Public（公开）
echo 4. 不要勾选任何初始化选项
echo 5. 创建完成后，复制仓库地址（例如：https://github.com/用户名/仓库名.git）
echo.
set /p REPO_URL="请粘贴您的 GitHub 仓库地址: "

if "%REPO_URL%"=="" (
    echo [错误] 仓库地址不能为空
    pause
    exit /b 1
)

echo.
echo [5/6] 添加远程仓库...
git remote add origin %REPO_URL% 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 远程仓库已存在，尝试更新...
    git remote set-url origin %REPO_URL%
)

echo.
echo [6/6] 推送到 GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo 部署成功！
    echo ====================================
    echo.
    echo 最后一步：开启 GitHub Pages
    echo.
    echo 1. 打开您的仓库页面
    echo 2. 点击 Settings（设置）
    echo 3. 左侧菜单找到 Pages
    echo 4. Source 选择 "Deploy from a branch"
    echo 5. Branch 选择 "main" 分支，文件夹选择 "/app"
    echo 6. 点击 Save 保存
    echo.
    echo 等待 1-2 分钟后，访问地址：
    echo https://您的用户名.github.io/仓库名/index.html
    echo.
    echo 手机预览地址：
    echo https://您的用户名.github.io/仓库名/preview.html
    echo.
    echo 将上面的手机预览地址填入 index.html 的二维码输入框即可！
    echo.
) else (
    echo.
    echo [错误] 推送失败，可能需要配置 GitHub 身份验证
    echo.
    echo 请确保：
    echo 1. 已登录 GitHub 账号
    echo 2. 配置了 Personal Access Token
    echo 3. 或使用 GitHub Desktop 进行推送
    echo.
)

pause
