#!/bin/bash

# Vérifier si supabase-cli est installé
if ! command -v supabase &> /dev/null; then
    echo "Installation de supabase-cli..."
    brew install supabase/tap/supabase
fi

# Se déplacer dans le répertoire du projet
cd "$(dirname "$0")/.."

# Initialiser Supabase s'il n'est pas déjà initialisé
if [ ! -d "supabase" ]; then
    echo "Initialisation de Supabase..."
    supabase init
fi

# Exécuter les migrations
echo "Exécution des migrations..."
supabase db push

echo "Migrations terminées !"
