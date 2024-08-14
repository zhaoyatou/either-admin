git checkout master
sleep 2
git pull
sleep 2
pnpm install
sleep 3
npm run build:prod
sleep 3
scp -r dist my_lecs:/root/www
sleep 3
echo "DEPLOYED PROD SUCCEED, TIME: "$(date +%F%n%T)