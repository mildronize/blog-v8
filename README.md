# Thadaw Site (v8)

A modern, fast, and feature-rich static site powered by Zola and deployed seamlessly on Azure Static Web Apps.

## 🚀 Features
- **Static Site Generator**: Built using [Zola](https://www.getzola.org/), a Rust-powered static site generator.
- **Serene Theme**: Based on the elegant [Serene](https://github.com/isunjn/serene) theme.
- **Automatic Post ID Generation**: Each post gets a unique ID, auto-generated when pushed to the main branch using the [Auto Add Post ID GitHub Action](.github/workflows/auto-add-id.yml).
- **Azure Static Web Apps Deployment**:
  - Automatic deployment to production when changes are pushed to the main branch using [Deploy to Azure Static Web App GitHub Action](.github/workflows/deploy.yml).
  - Automatic preview deployments triggered by pull requests.
- **Dynamic 404 Handling**: Automatically resolves URLs with a post ID to the correct post. For example, `/s/123` redirects to `/post/this-is-a-post`.
- Enable Giscus comment, which is already provided by the theme.
- Enable Anonymous Reaction, any user can react with Emoji ❤️ to the post without login, which is already provided by the theme.
   - The backend is reimplemented in Azure Functions with TypeScript. Checkout [Reaction](https://github.com/mildronize/reaction) repo for more detail.

## 🛠️ Local Development

Follow these steps to set up the project for local development:

```bash
# Clone the repository
git clone git@github.com:mildronize/blog-v8.git

# Initialize and update submodules
git submodule update --init --recursive

# Start the development server
make dev
```

## 🔑 Generate Azure Credentials

To enable the [Deploy to Azure Static Web App GitHub Action](https://www.notion.so/wrmsoftware/.github/workflows/deploy.yml) for preview environments, you need to generate Azure credentials:

1. Run the following command in your Azure CLI to create a service principal:
    
    ```bash
    az ad sp create-for-rbac --name "github-actions/deploy/thadaw-main-site-v8" --role contributor --scopes /subscriptions/xxxxxx/resourceGroups/rg-open-sources/providers/Microsoft.Web/staticSites/thadaw-main-site-v8 --sdk-auth
    ```
    
2. Copy the output JSON and add it as a GitHub secret in your repository settings with the name `AZURE_CREDENTIALS`.

## 📄 License

This project is licensed under the MIT License.