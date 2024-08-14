git checkout master
sleep 2
git pull
sleep 2
pnpm install
sleep 3
npm run build:dev
sleep 3
scp -r dist my_ecs:/root/www
sleep 3
echo "DEPLOYED TEST SUCCEED, TIME: "$(date +%F%n%T)