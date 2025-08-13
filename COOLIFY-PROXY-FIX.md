# COOLIFY PROXY FIX - API ROUTING PROBLEM

## PROBLEM CONFIRMED

- ✅ `localhost:3000/api/debug` works (container içinde)
- ❌ `zumenzu.com/api/debug` 404 (domain üzerinden)
- **Problem: Coolify proxy configuration**

## IMMEDIATE SOLUTION

### 1. Check Coolify Proxy Configuration

Go to **Configuration > General > Domains**:

Current config should be:

```
Domain: https://zumenzu.com
Direction: Redirect to non-www
```

### 2. ADD Custom Headers (IF NEEDED)

Go to **Configuration > Advanced > Custom Headers**

Add these headers if they don't exist:

```
X-Forwarded-Proto: $scheme
X-Forwarded-For: $proxy_add_x_forwarded_for
X-Real-IP: $remote_addr
Host: $host
```

### 3. CHECK FOR CUSTOM NGINX CONFIG

If you have custom nginx config, ensure API routes are NOT blocked:

```nginx
# This should NOT be in your config:
location /api {
    return 404;  # REMOVE THIS IF EXISTS
}

# This SHOULD be in your config (usually automatic):
location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 4. RESTART COOLIFY PROXY

In Coolify dashboard:

1. Go to **Servers** (left menu)
2. Find your server
3. Click **Restart Proxy**

### 5. FORCE DOMAIN REFRESH

After proxy restart:

1. Go back to **Configuration > General**
2. Click **Generate Domain** button again
3. Wait 30 seconds

### 6. TEST IMMEDIATELY

Try these URLs in browser:

```
https://zumenzu.com/api/debug
https://zumenzu.com/api/health
https://zumenzu.com/api/users/profile
```

## COMMON COOLIFY PROXY ISSUES

### Issue 1: Domain Configuration

- Domain might not be properly configured
- SSL certificates might be blocking API routes

### Issue 2: Proxy Cache

- Coolify proxy cache might be serving old routes
- Restart proxy clears this

### Issue 3: Custom Nginx Rules

- Custom nginx config might be blocking /api paths
- Check for any custom server blocks

## EMERGENCY BYPASS TEST

If still not working, try HTTP (temporarily):

```
http://zumenzu.com/api/debug
```

If HTTP works but HTTPS doesn't, it's SSL/certificate issue.

## LAST RESORT: REDEPLOY PROXY

If nothing works:

1. **Servers > Your Server > Actions > Restart Proxy**
2. Wait 2 minutes
3. **Configuration > Redeploy** (force full redeploy)

This will regenerate ALL proxy configurations.
