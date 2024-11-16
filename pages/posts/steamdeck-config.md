---
title: My Steam Deck config and customization.
date: 2024-10-28
lang: en
plum: false
---

<p align="center">
    <img src="/images/posts/steamdeck/steamdeck.png" style="border: none;"/>
</p>

# Preparation

Mostly, we config our Steam Deck in `Desktop Mode`, so I highly recommend you connect your device with
a `USB Hub` , then connect your `mouse` and `keyboard` . `Bluetooth` keyboard and mouse are also good.

If you don't have external mouse and keyboard besides you, just use the buttons.

This is a part of key mappings.

| Button           | Desktop           |
| ---------------- | ----------------- |
| `R2`             | Mouse Left Click  |
| `L2`             | Mouse Right Click |
| `Right Touchpad` | Mouse Move        |
| `STEAM + X`      | Call Keyboard     |

By this way, you can directly control your device in `Desktop Mode`, but it's a little bit `inconvenient`.

If you feel hard to operate Deck using buttons, you may enable `Remote Desktop`. See: [Enable Remote Desktop](#enable-remote-desktop).

# Environment

## Do it first

### Add password to current user

In `Desktop Mode`, open `Konsole`, and `add a password` to current user, for sudo use.

```shell
passwd

# New password:
# Your input will not appear, please make sure your input is correct, then push ENTER.
```

### Disable `steamdeck-readonly`

> [!NOTE]
> You may need to re-run the following commands after system update.

```shell
# disable
sudo steamos-readonly disable

# enable(if you want to enable it again after config.)
sudo steamos-readonly enable
```

## Recommended Options

### Change `Desktop Mode` Language

You can choose your language in `Desktop Mode`, follow the guide in KDE UserBase Wiki: [https://userbase.kde.org/Tutorials/Change_Plasma_Language](https://userbase.kde.org/Tutorials/Change_Plasma_Language)

### Config `Flatpak`

For `most users`, you can skip this part. This part is for users who have trouble searching apps in `Discover`, mainly for `users in China`.

If your `Discover` searching has no response, please `change the remote mirror`.

```shell
# This will overwrite the official mirror link.
sudo flatpak remote-modify flathub --url=https://mirror.sjtu.edu.cn/flathub

# If you don't want to overwrite, you can add a mirror link.
sudo flatpak remote-add flathub https://mirror.sjtu.edu.cn/flathub/flathub.flatpakrepo
```

### Install a browser

Some plugins may depend on browser to setup, so a browser is needed. You can install any browser you are favorite. Directly install it through `Discover`.

### Enable `Remote Desktop`

Steam Deck uses `KDE Plasma` desktop, we can use `krfb` to start a `remote desktop` service.

We need to install `krfb` on Deck, then we can use `VNC` protocol to remote connect our device in `Desktop Mode`.

```shell
sudo pacman -Sy krfb
```

If you `can't install pacman packages because of unknown trust`, please do:

> [!NOTE]
> You may need to re-run the following commands after system update.

```shell
# Step 1
sudo pacman-key --init

# Step 2
sudo pacman-key --populate archlinux
sudo pacman-key --populate holo
```

Then, re-run your command.

Now you can use your `VNC Client` to connect to the Deck. `Default port: 5900`.

#### VNC Client

For Windows users, `VNC Viewer` is an option.

The app in the picture below is `Royal TSX`.

![remote](/images/posts/steamdeck/remote-desktop.png)

# Customizations

## AUR

If you want to install AUR(Arch User Repository) packages, please install an AUR helper.

`base-devel` is needed in most cases.

```shell
# Install base-devel
sudo pacman -S base-devel

# Install AUR helper
sudo pacman -Sy paru
# or
sudo pacman -Sy yay
# etc...
```

## Localsend

Wirelessly transfer files in local network.

AUR helper is required!!!

```shell
paru -Sy localsend-bin
# or yay -Sy
```

![localsend](/images/posts/steamdeck/localsend.png)

## Google Chrome

Directly install it through `Discover`.

## Decky Loader

**`Decky Loader`** is a `plugin store` in `Gaming Mode`, you can press `...` button to find it after installation.

Official Site: [https://decky.xyz/](https://decky.xyz/)

GitHub: [https://github.com/SteamDeckHomebrew/decky-loader](https://github.com/SteamDeckHomebrew/decky-loader)

![decky](/images/posts/steamdeck/decky.png)

### Install `Decky Loader`

Firstly, Do the following things:

1. Switch to `Gaming Mode`,
2. Push `STEAM` Button, Choose `Settings`, find `Development Mode` and enable it, Your menu has a new option: `Developer` now.
   ![decky](/images/posts/steamdeck/developer-mode.png)
3. Choose `Developer`, find `CEF Remote Debugging` and enable it.

4. Restart Steam Deck (Reboot).

After reboot, Your device will enter `Gaming Mode` defaultly, you need to switch back to `Desktop Mode`.

Then, you can choose either way:

- Download [`decky_installer.desktop`](https://decky.xyz/download).
- Or, fast install it using `Konsole`.

```shell
# Official mirror
curl -L https://github.com/SteamDeckHomebrew/decky-installer/releases/latest/download/install_release.sh | sh

# China mirror
curl -L http://dl.ohmydeck.net | sh

# Local Script
# Find `install_decky_loader.sh` in this repo, and download or copy it.
./install_decky_loader.sh
```

Finally, Switch to `Gaming Mode` and push `...` button, you can see `Decky` menu.

### Uninstall `Decky Loader` (if needed)

If you installed it with `decky_installer.desktop`, please choose `uninstall decky loader` in `Application Menu`, or search `uninstall decky loader`, just find it and run.

If you installed it with `shell script`, run:

```shell
# Local Script
# Find `uninstall_decky_loader.sh` in this repo, and download or copy it.
./uninstall_decky_loader.sh
```

### Notice

Sometimes, `Decky` disappear after `SteamOS update`, just reinstall it using the methods above, your config of plugins will keep.

### Plugins I currently use

- `SteamGridDB` - Add artwork to your non-steam apps.
  ![steamgriddb](/images/posts/steamdeck/SteamGridDB.png)
- `vibrantDeck` - Change saturation of your screen.

## RPCS3 (PS3 Emulator)

See this part in my repo: [https://github.com/Vincent-the-gamer/linux-rpcs3-quickstart](https://github.com/Vincent-the-gamer/linux-rpcs3-quickstart)

## Chiaki4deck (Stream play PS4/PS5 games)

![chiaki4deck](/images/posts/steamdeck/chiaki4deck.png)

### Installation

Search and install it in `Discover`(Desktop mode).

### Configuration

See: [https://streetpea/images/posts/steamdeck/.io/chiaki4deck/setup](https://streetpea/images/posts/steamdeck/.io/chiaki4deck/setup)

Recommended video config:

![recommend](/images/posts/steamdeck/chiaki4deck-recommend.png)

Change the bitrate to 10000 if your connection is unstable or slow.

> [!NOTE]
> To get your base64 PSN account for chiaki, See [https://psn.flipscreen.games/](https://psn.flipscreen.games/)
