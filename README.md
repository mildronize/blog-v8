# Blog with Zola

```
git clone git@github.com:mildronize/blog-v8.git
git submodule update --init --recursive
```

## Development

```
make dev
```

## Generate Azure Credentials

```
az ad sp create-for-rbac --name "github-actions/deploy/thadaw-main-site-v8/storage-account" --role contributor --scopes /subscriptions/xxxxxx/resourcegroups/rg-open-sources/providers/Microsoft.Storage/storageAccounts/yyyy --sdk-auth
```