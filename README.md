# This is a tool collections for develpoer

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Docker Development

Requires Docker Engine with Docker Compose v2 or later.

```bash
cp -n .env.example .env
# Edit .env to set GIT_USER_NAME and GIT_USER_EMAIL before committing.
docker compose up --build -d
docker compose logs -f dev
```

Open http://localhost:4006 (or the port configured with `DEV_PORT`).
The container includes Node.js 22, Yarn Classic, Git, an SSH client, GnuPG,
curl, Python 3, and native dependency build tools. It runs as the non-root
`node` user (UID/GID 1000); Linux bind-mounted files must be writable by that user.
The development server binds to all container interfaces, but the published
port is restricted to the host's loopback interface.
If `.env` already exists, add the variables from `.env.example` to it rather
than replacing it.

The repository, including `.git`, is bind-mounted at `/workspace`, so changes
and commits made inside Docker are immediately visible on the host.
Dependencies, Next.js build files, and the container user's home directory use
separate named volumes. Host `node_modules` and `.next` are not reused.
Yarn installs dependencies from `yarn.lock` on startup; restart the service
after changing dependencies outside the container.
TypeScript is an explicit development dependency because Next.js's ESLint
configuration requires it even when the application uses JavaScript.

```bash
docker compose exec dev bash
# Inside the container:
yarn lint
yarn build
git status
git add <files>
git commit -m "Describe your changes"
git push
```

### Git Credentials

Host credential helpers such as macOS Keychain are not available inside Linux
containers. The container does not automatically import host Git configuration,
passwords, tokens, SSH private keys, or signing keys.

**HTTPS:** use an HTTPS Git remote and run `git push` interactively inside the
container. Enter your Git hosting username and a personal access token when
prompted (not your account password). Git caches credentials in memory for
one hour; they are not stored in plaintext on disk and must be entered again
after the cache expires or the container restarts. To clear them immediately:

```bash
docker compose exec dev git credential-cache exit
```

**SSH (optional):** load your key into the host's SSH agent, then enable the
SSH override. Only the agent socket is forwarded; private key files are not copied.

```bash
# Docker Desktop for macOS:
docker compose -f compose.yaml -f compose.ssh.yaml up --build -d

# Linux: forward the existing host agent socket.
SSH_AGENT_SOCKET="$SSH_AUTH_SOCK" \
  docker compose -f compose.yaml -f compose.ssh.yaml up --build -d
```

Other Docker runtimes may require a runtime-specific agent socket path.
Set `SSH_AGENT_SOCKET` accordingly; the source must be an existing Unix socket
accessible to the container user. If agent access is denied, fix the agent/socket
permissions or use HTTPS instead of making private keys world-readable.
Use the same Compose file arguments for subsequent lifecycle commands.
Ensure your Git remote uses SSH if choosing this authentication method.
On the first connection, verify the Git server's SSH host key fingerprint
against the provider's published fingerprint before accepting it.
Trusted hosts are retained in the `dev_home` volume.

Git identity and any configuration you set with `git config --global` also
persist in `dev_home`. Non-empty `GIT_USER_NAME` and `GIT_USER_EMAIL` values in
`.env` override the saved identity on startup. SSH forwarding grants processes
inside the container access to the loaded agent, so only run trusted code.
Commit signing requires configuring your signing key separately; no keys are
imported automatically.

```bash
docker compose down
# Destructive: also deletes container dependencies, build cache, and user home.
# This does not delete the bind-mounted repository or its commits.
docker compose down -v
```

Never put credentials into the Dockerfile, Compose configuration, remote URL,
or tracked files. `.env` is ignored by Git, and the Docker build context includes
only the development Dockerfile and entrypoint.
SSH directories, standard SSH key filenames (including public keys), private-key
file extensions, and Git credential files are also ignored. Keep keys outside
the repository, such as in the container's `~/.ssh` directory. Ignore rules do
not protect arbitrarily named secrets or files that are already tracked; never
use `git add -f` to add credentials.

## Polar Webhook

Configure Polar to send webhook events to `https://<your-domain>/tools/polar/webhook`.
The endpoint accepts POST requests, prints the JSON payload to the server console,
and returns `200 OK`. Invalid JSON is logged and returns `400 Bad Request`.

To test locally with the development server running:

```bash
curl -i http://localhost:4006/tools/polar/webhook \
  -H 'Content-Type: application/json' \
  -d '{"type":"test","data":{"message":"Hello from Polar"}}'
```

This endpoint is for debugging only and does not verify webhook signatures.
Do not use it for trusted event processing without adding signature verification.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Use Node.js 22 for deployments. Next.js and `eslint-config-next` are pinned to
16.4.3, with React and React DOM pinned to 19.2.9 for security fixes.
After upgrading, commit the manifest and both lockfiles, then redeploy.
Clearing the build cache alone does not fix a vulnerable dependency version.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
