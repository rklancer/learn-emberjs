desc "Puts a static, working copy of the Learn.Ember.js tutorial into ./dist/index.html"
task :build do
  sh 'bpm rebuild'
  rm_rf 'dist'
  mkdir 'dist'
  mkdir_p 'dist/ace/build'
  cp_r 'ace/build/src', 'dist/ace/build'
  cp_r 'assets', 'dist'
  # FileUtils.cp_r copies symlinks as symlinks rather than what we want here, which is to copy the the contents
  # of the file pointed to by the symlink. This is the behavior of the shell command 'cp -r'.
  sh 'cp -r iframe dist'
  mkdir_p 'webfonts'
  cp_r 'webfonts', 'dist'
  cp 'index.html', 'dist'
end

desc "Makes a tarball of Learn.Ember.js that can be expanded in the desired directory of an HTTP server"
task :tarball => :build do
   sh 'cd dist; tar cfz ../learn-emberjs.tar.gz .'
end

task :default => :tarball
