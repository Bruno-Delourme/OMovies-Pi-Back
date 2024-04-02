# Créer la base de donnée
  
  À taper dans la console: 

```
  bash scripts/1.init_db.sh
```

# Déployer le projet sqitch (créer les tables et les fonctions)

```
bash scripts/3.sqitch_deploy.sh
```

# Tests

Décommenter le test souhaité dans le fichier test.http et cliquer sur "Send Request" .