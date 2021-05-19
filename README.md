# file-sharing
Simple file sharing project, with 3 nodes: Master Server, File Server and Client Server.

Before running, two folders must be created in the root directory:

- `data` folder: For files fileserver is serving
- `downloads` folder: For files client downloaded

## Master Server
```
yarn masterserver
```
## File server

```
yarn fileserver:test
```

## Client server
```
yarn client
```

### Test
```
yarn client:test-download <filename>
```