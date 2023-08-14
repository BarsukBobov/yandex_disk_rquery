# yandex_disk_rquery
Node.js v18.16.0

# DEMO
www.yaroscosh.ru

# CRA
### `npm install`
### `npm start`
### `npm run build`
### `serve -s build`

# NGINX

Установка:
```
apt install nginx
nano /etc/nginx/sites-available/react_test
```
Вставить содержимое из файла react_test.txt(в папке "server_files")
После сделать ссылку на конфиг, в папке sites-enabled:

```
ln -s /etc/nginx/sites-available/react_test /etc/nginx/sites-enabled
systemctl restart nginx 
```
Lets Enscript:
```
apt-get install python3-certbot-nginx
certbot --nginx
systemctl restart nginx 
```

# Автозапуск

Создать служебный файл и заполнить содержимое соответствующим файлом из папки "server_files"

```
nano /etc/systemd/system/react_autorun.service
systemctl daemon-reload
systemctl enable react_autorun.service
systemctl start  react_autorun.service
```

# P.s.
На продакшене не безопасно сохранять токен в localstorage, поэтому лучше связать компонент с
серверным приложением, где будут сохраняться токены вместе с куки.
