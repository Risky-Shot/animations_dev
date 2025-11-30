fx_version "cerulean"
lua54 'yes'
game 'rdr3'
rdr3_warning 'I acknowledge that this is a prerelease build of RedM, and I am aware my resources *will* become incompatible once RedM ships.'

author 'RiskyShot'
name 'risky_animation_devtool'
description 'A devtool to test Animations. Thanks to spAnser (Pioneer Village)'

client_script 'client.lua'

ui_page 'web/dist/index.html'

files {
    'web/dist/assets/*.js',
    'web/dist/assets/*.css',
    'web/dist/index.html',
    'web/dist/animations.json',
}
