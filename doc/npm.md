> npm 脚本的原理非常简单。每当执行npm run，就会自动新建一个 Shell，在这个 Shell 里面执行指定的脚本命令。因此，只要是 Shell（一般是 Bash）可以运行的命令，就可以写在 npm 脚本里面。

- yarn link会找文件夹下的package.json，没有找到会找当前文件夹的外层文件夹,而npm link 会生成一个带有package.json的空包。
# 参考资料
- [npm_scripts](https://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)