#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import os
from urllib.parse import urlparse

def download_image(url, filepath):
    """Download an image from URL to filepath"""
    try:
        # Add https if the URL starts with //
        if url.startswith('//'):
            url = 'https:' + url

        response = requests.get(url, stream=True)
        response.raise_for_status()

        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        print(f"Downloaded: {filepath}")
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

def extract_skill_icons():
    """Extract all skill icon URLs from the Amon page"""
    url = "https://borderlands.2k.com/borderlands-4/game-info/vault-hunters/amon/"

    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        skill_icons = []

        # Find all images that appear to be skill icons
        images = soup.find_all('img')

        for img in images:
            src = img.get('src', '')
            alt = img.get('alt', '')

            # Look for skill icon patterns in the URL
            if 'BL4_Amon_Tree' in src and ('Passive' in src or 'Active' in src or 'Augment' in src or 'Capstone' in src):
                # Clean up the URL
                if src.startswith('//'):
                    src = 'https:' + src

                # Extract skill tree and skill name from URL or alt text
                skill_tree = 'unknown'
                if 'Calamity' in src:
                    skill_tree = 'calamity'
                elif 'Vengeance' in src:
                    skill_tree = 'vengeance'
                elif 'Cybernetics' in src:
                    skill_tree = 'cybernetics'

                skill_icons.append({
                    'url': src,
                    'alt': alt,
                    'skill_tree': skill_tree,
                    'filename': os.path.basename(urlparse(src).path)
                })

        return skill_icons

    except Exception as e:
        print(f"Error extracting skill icons: {e}")
        return []

def main():
    """Main function to download all skill icons"""
    print("Extracting skill icon URLs...")
    skill_icons = extract_skill_icons()

    if not skill_icons:
        print("No skill icons found!")
        return

    print(f"Found {len(skill_icons)} skill icons")

    # Create base directory
    base_dir = "skill-icons/amon"
    os.makedirs(base_dir, exist_ok=True)

    # Download each icon to appropriate directory
    for icon in skill_icons:
        tree_dir = os.path.join(base_dir, icon['skill_tree'])
        os.makedirs(tree_dir, exist_ok=True)

        filepath = os.path.join(tree_dir, icon['filename'])

        print(f"Downloading {icon['alt']} ({icon['skill_tree']})...")
        download_image(icon['url'], filepath)

    print("Download complete!")

    # Print summary
    print("\nSummary:")
    for tree in ['calamity', 'vengeance', 'cybernetics']:
        tree_icons = [i for i in skill_icons if i['skill_tree'] == tree]
        print(f"{tree.title()}: {len(tree_icons)} icons")

if __name__ == "__main__":
    main()