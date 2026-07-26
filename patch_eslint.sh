sed -i 's/} catch (e) { \/\* ignore \*\/ }/} catch { console.debug("session read ignored"); }/g' src/components/common/MusicPlayer.astro
sed -i 's/} catch (_e) {}/} catch { console.debug("session write ignored"); }/g' src/components/common/MusicPlayer.astro
