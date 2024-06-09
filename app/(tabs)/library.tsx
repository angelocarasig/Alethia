import { YStack, XStack, View } from 'tamagui';

import MangaCard from 'components/library/manga';

import { Manga } from 'types/manga/manga';
import { ReadStatus, ContentStatus } from 'types/manga/status';
import { ContentRating } from 'types/manga/contentRating';
import SearchInput from 'components/base/searchInput';
import { useState } from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import { FileOutput } from '@tamagui/lucide-icons';

const SAMPLE_DATA: Manga[] = [
  {
    id: '1',
    sourceId: '1',
    title: 'Jungle Juice',
    author: "Youn In-Wan",
    artist: "Juder",
    description: "some text 123",
    tags: [
      { title: "Action" },
      { title: "Fantasy" },
      { title: "Horror" },
      { title: "Sci-Fi" },
      { title: "Superhero" },
      { title: "Thriller" },
    ],
    readStatus: ReadStatus.Reading,
    contentStatus: ContentStatus.Ongoing,
    contentRating: ContentRating.Safe,
    coverUrl: "https://mangadex.org/covers/80d288be-bdb9-4637-804e-02b2f89ad2d8/dfdb5c3b-d1eb-48df-abb4-7c22816477d3.png.512.jpg"
  },
  {
    id: '2',
    sourceId: '2',
    title: 'The Infinite Mage',
    author: "Kimchi Woo",
    artist: "Kiraz",
    description: "This is the tale of a boy dreaming about infinity as a human! Found abandoned in a stable, Shirone is the son of a hunter—and a peasant through and through. Despite hardships, he's a genius that manages to learn to read by himself and becomes obsessed with it. Brimming with genius talent, he goes to the city with his father, where he learns about magic—beginning his journey as an explosive rising star!",
    tags: [
      { title: "Action" },
      { title: "Adventure" },
      { title: "Magic" },
      { title: "Fantasy" },
      { title: "Web Comic" },
      { title: "Adaptation" },
      { title: "Full Color" }
    ],
    readStatus: ReadStatus.Reading,
    contentStatus: ContentStatus.Ongoing,
    contentRating: ContentRating.Safe,
    coverUrl: "https://mangadex.org/covers/4d97b35d-2d9f-4369-964f-3b0ce2c7fbbc/80590dee-2e33-4918-8ca9-fbdd24a744a0.jpg.512.jpg"
  },
  {
    id: '3',
    sourceId: '3',
    title: 'Demon King of the Royal Class',
    author: "로노루",
    artist: "글쟁이s",
    description: "Upon dying, the author of 'The Demon King is Dead' is given two choices: go to hell or be reborn in his novel and survive till the end. The problem? He's reborn as Baalier Junior, a weak demon prince, after his realm was conquered! To make things worse, his attempt to escape somehow gets him enrolled as a student of the Royal Class in Gradias Temple, a prestigious human school. In the midst of plotlines and political schemes, can this author keep his identity a secret and reach a happy ending?",
    tags: [
      { title: "Reincarnation" },
      { title: "Action" },
      { title: "Demons" },
      { title: "Long Strip" },
      { title: "Comedy" },
      { title: "Adventure" },
      { title: "Magic" },
      { title: "Harem" },
      { title: "Isekai" },
    ],
    readStatus: ReadStatus.Reading,
    contentStatus: ContentStatus.Ongoing,
    contentRating: ContentRating.Safe,
    coverUrl: "https://mangadex.org/covers/d2a01e38-1c0d-4e4b-a9ae-21d119e8b326/9fcea8e7-21d0-4933-868a-989b459a6bf9.jpg.512.jpg"
  },
  {
    id: '5',
    sourceId: '5',
    title: 'Yuusha to Yobareta Nochi ni: Soshite Musou Otoko wa Kazoku wo Tsukuru',
    author: "Sorano Kazuki",
    artist: "Musuaki",
    description: "In a world where humans and demons clash—the one who decimated the Demon Lord’s army was a lone hero named Lloyd. Possessing power so immense that he was said by the Demon Lord to be near godlike, after the war, Lloyd was appointed by the king to be the lord of a remote territory and was sent far away. Furthermore, he was tasked with subduing the Emperor Dragon residing in that land, which he quickly defeated. However, the defeated dragon transformed into a beautiful woman and chose to become Lloyd’s companion!? This is the story of a man, hailed as the strongest, yet unable to recognize his own worth, finding a “family”.",
    tags: [
      { title: "Action" },
      { title: "Romance" },
      { title: "Drama" },
      { title: "Fantasy" },
      { title: "Adaptation" },
    ],
    readStatus: ReadStatus.Reading,
    contentStatus: ContentStatus.Ongoing,
    contentRating: ContentRating.Suggestive,
    coverUrl: "https://mangadex.org/covers/a58747fa-3bca-43ff-9187-549b00f43578/e22ea3b8-f61c-4668-87c2-d8cf68cfba56.jpg.512.jpg"
  },
  {
    id: '6',
    sourceId: '6',
    title: 'Houkago Kitaku Biyori',
    author: 'Matsuda Mai',
    artist: 'Matsuda Mai',
    description: `Shun was invited to the Going-Home Club by Naoki Satou, also known as "Chokki-chan". Despite refusing, he ends up being somewhat forcefully involved in the club's activities! A Going Home Club rom-com featuring a detour-loving high school girl and a new high school student who has lost his dream.`,
    tags: [
      { title: 'Romance' },
      { title: 'Comedy' },
      { title: 'School Life' },
      { title: 'Slice of Life' },
      { title: 'Seinen' }
    ],
    readStatus: ReadStatus.Reading,
    contentStatus: ContentStatus.Ongoing,
    contentRating: ContentRating.Safe,
    coverUrl: 'https://mangadex.org/covers/85b3504c-62e8-49e7-9a81-fb64a3f51def/a1c0d064-0713-48ad-a14e-ae022179ea9d.jpg.512.jpg'
  }
];

export default function LibraryScreen() {
  const [filteredData, setFilteredData] = useState(SAMPLE_DATA);

  const handleSearch = (searchText: string) => {
    const filtered = SAMPLE_DATA.filter(manga =>
      manga.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <YStack f={1} ai="center" gap="$4" px="$4" pt="$5">
      <SearchInput
        placeholder='Search Library'
        onSearchChange={handleSearch}
      />
      <YStack f={1} ai="center" px="$1">
        <XStack f={1} gap="$2" flexWrap="wrap" width="100%">
          {filteredData.map((manga) => (
            <MangaCard manga={manga} key={manga.id} />
          ))}
        </XStack>
      </YStack>
    </YStack>
  )
}
