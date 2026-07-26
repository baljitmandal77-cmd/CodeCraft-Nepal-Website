sed -i 's/function getAudio(): HTMLAudioElement | null {/function getAudio(): HTMLAudioElement | null {\n      return win.__globalBgAudio || null;\n    }/g' src/components/common/MusicPlayer.astro
