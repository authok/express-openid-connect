# Troubleshooting

If you're running into problems there are 2 sources of logs you can check to get more information about what's going on:

## 1. Debug logs

Add the `DEBUG` environment variable and filter the messages by `express-openid-connect`.

```shell script
$ DEBUG=express-openid-connect:* node index.js
```

On Windows, use the corresponding command.

```shell script
> set DEBUG=express-openid-connect:* & node index.js
```

For more information about `debug`, see [debug](https://github.com/visionmedia/debug)

## 2. Authok tenant logs

If you're an Authok customer, you can check out what's happening on the Authorization Server using your [Authok tenant logs](https://manage.authok.com/#/logs).

Visit [View Log Data in the Dashboard](https://authok.com/docs/logs/guides/view-log-data-dashboard) for more information.
