import re

with open('src/components/common/MusicPlayer.astro', 'r') as f:
    code = f.read()

# The messed up part is around line 175:
#           if (state.currentTime > 0) {
#             const targetTime = state.currentTime;
#             const onLoaded = () => {
#               if (win.__globalBgAudio) win.__globalBgAudio.currentTime = targetTime;
#               win.__globalBgAudio?.removeEventListener('loadedmetadata', onLoaded);
#             };
#             win.__globalBgAudio.addEventListener('loadedmetadata', onLoaded);
#           }
#           if (state.src) win.__globalBgAudio.src = state.src;
#             const targetTime = state.currentTime;
#             win.__globalBgAudio.addEventListener('loadedmetadata', function onLoaded() {
#               if (win.__globalBgAudio) win.__globalBgAudio.currentTime = targetTime;
#               win.__globalBgAudio?.removeEventListener('loadedmetadata', onLoaded);
#             });
#           }
#           if (state.isPlaying) {

# Let's just find the start and end and replace it.
pattern = re.compile(r'          if \(state\.currentTime > 0\) \{.*?          if \(state\.isPlaying\) \{', re.DOTALL)
replacement = """          if (state.currentTime > 0) {
            const targetTime = state.currentTime;
            const onLoaded = () => {
              if (win.__globalBgAudio) win.__globalBgAudio.currentTime = targetTime;
              win.__globalBgAudio?.removeEventListener('loadedmetadata', onLoaded);
            };
            win.__globalBgAudio.addEventListener('loadedmetadata', onLoaded);
            if (win.__globalBgAudio.readyState >= 1) win.__globalBgAudio.currentTime = targetTime;
          }
          if (state.src) win.__globalBgAudio.src = state.src;
          if (state.isPlaying) {"""

code = pattern.sub(replacement, code, count=1)

with open('src/components/common/MusicPlayer.astro', 'w') as f:
    f.write(code)
