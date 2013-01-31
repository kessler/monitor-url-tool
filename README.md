Monitor url tool
================

Simple too to monitor one or more urls. The tool will beep in error events.

### Install ###

```
	npm install -g monitor-url-tool
```

### Usage ###

```
	monurl 5000 http://www.example.com
```
will check example.com every 5 seconds.
```
	monurl 5000 servers.conf
```
while servers.conf will look like this:
```
	google, http://www.google.com
	yahoo, http://www.yahoo.com
	#comments can be embedded in the file, but only in their own line
	facebook, http://www.facebook.com
```
the tool also provides a cli which allows adding servers after its been started:
```
	monitor> addServer('beer', 'http://beer.com')
```

