call npm install --arch=ia32
call npm install sqlite3@4.2.0 --arch=ia32
call node_modules\.bin\electron-rebuild.cmd --arch=ia32 -f -w node-sword-interface -v 13.2.3
call copy node_modules\node-sword-interface\build\sword-build-win32\lib\*.dll node_modules\node-sword-interface\build\Release\
call npm run commit-info
call npm run install-node-prune-win
call npm run prune-node-modules
call npm run package-win
call npm run fix-binary-timestamps
call npm run installer-win
