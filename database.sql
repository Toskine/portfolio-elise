-- Structure de la base de données pour le portfolio d'Élise

-- 1. Table des Collections (pour regrouper les peintures par thème)
CREATE TABLE collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT
);

-- 2. Table des Œuvres (pour stocker toutes les informations d'une peinture)
CREATE TABLE oeuvres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10, 2), -- Prix avec 2 décimales (ex: 150.00)
    statut ENUM('disponible', 'vendu') DEFAULT 'disponible',
    image_fichier VARCHAR(255) NOT NULL, -- Le nom du fichier image (ex: elise_1.jpeg)
    collection_id INT,
    date_creation DATE,
    FOREIGN KEY (collection_id) REFERENCES collections(id)
);

-- ==========================================
-- EXEMPLES DE DONNÉES (Pour vous aider à démarrer)
-- ==========================================

-- Ajout de quelques collections
INSERT INTO collections (nom, description) VALUES
('Animaux', 'Peintures animalières expressives'),
('Paysages', 'Inspirations de la nature et voyages'),
('Abstrait', 'Exploration de couleurs et formes');

-- Ajout de quelques peintures avec leur prix et leur statut
INSERT INTO oeuvres (titre, prix, statut, image_fichier, collection_id) VALUES
('Chat Étoilé', 150.00, 'vendu', 'elise_14_cat.png', 1),
('L''Arbre Solitaire', 120.00, 'vendu', 'elise_15_tree.png', 2),
('Village Grec', 200.00, 'vendu', 'elise_16_town.png', 2),
('Papillon Flamboyant', 95.00, 'vendu', 'elise_17_butterfly.png', 1),
('Œuvre 1', 110.00, 'disponible', 'elise_1.jpeg', 3);
