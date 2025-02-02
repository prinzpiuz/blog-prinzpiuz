---
title: "System Backup With Restic"
date: 2025-01-25T23:07:40+05:30
draft: true
categories: [backup, restic, backup-strategies, backup-strategies-for-linux]
bloTils-like: false
audio: false
modified_date: false
---

This blog post continues the discussion on my backup strategies. If you haven't read the previous post, please check it out [here](/post/my_backup_strategies/).  

Currently, all the machines I am using run on Linux, so this post will focus on How I use Restic for Linux systems.  

**Experiences With System Backups**  

My experience with backup software includes using [URBackup](https://www.urbackup.org/). I implemented it as a common backup solution for my workplace, where we operated a LAN setup on a 2 TB server for about 20 users, consisting of both Linux and Windows platforms. URBackup follows a client-server architecture, requiring the installation of a client on each user machine. Unfortunately, we discontinued the project when the COVID-19 lockouts began.  

One of the advantages of URBackup was its web interface, along with a straightforward command-line setup for Linux and a simple restoration process. However, we encountered some downsides: it lacked image backup support for Linux and did not support Mac machines.

**Rsync vs Restic**

Although [rsync](https://rsync.samba.org/) is a powerful tool designed for efficient file synchronization, it may not meet all your backup needs. If you're looking for a more robust backup solution, Restic is an excellent choice. Restic stands out with its advanced features, including strong encryption that safeguards your data from unauthorized access, deduplication that saves storage space by eliminating duplicate copies of files, and versioning that allows you to revert to previous states of your files when necessary.  

Moreover, Restic simplifies the process of storing backups on various remote cloud storage services, making it an ideal option for safeguarding critical data. This is particularly important for maintaining data integrity and ensuring long-term retention of valuable files. In contrast, rsync is primarily tailored for tasks involving efficient file transfers and basic synchronization between two directories or systems, lacking the extensive backup features that Restic provides.  

**What Is Restic?**  

Restic is a modern backup solution written in Go that can backup data from Linux, macOS, Windows, and BSD machines. It features encryption, support for various storage backends, incremental backups, and verifiable backups.  

**Why Restic?**

Why Not?

- It's Free
- It's Simple & Easy To Use
- Its Fast
- It's Secure
- It's Flexible
- It's Open Source
- Best Documentation

**My Machines**

I primarily have three machines: one workstation, a personal computer, and a home server. You can find hardware details about these machines [here](/uses/). As the name suggests, the workstation is primarily for work-related tasks, while the personal computer is used for my personal interests and hobbies, including this blog. The home server is an old desktop that I've been using for over 15 years. Currently, it is utilized for self-hosting some applications and as a media server. You can read more about it [here](/post/things-i-self-hosting/).  

**How I Am Using Restic?**  

I am using restic primarily for taking snapshot backups in workstation and personal machine. And for my home server I am using it for backing up my config files.  

Also, I am using `SFTP` method to backup, which is a secure method to transfer files over the network. So it will send backups to a central repository, Which is created inside a network attached storage of mine.  

In my case I am using an external hard drive attached to my home server as central repository. You can see the repository structure below.  

```bash
tree -d -L 1 .
.
├── Media_Server
├── Personal
└── Workstation
```

Where Media Server is my home server, Personal is my personal machine, and Workstation is my workstation.  

I Initially started with Restic Binary, and it was little difficult to call restic command with all those arguments. But now I have moved to [restic profile](https://github.com/creativeprojects/resticprofile/) to manage restic configuration, and it is very easy to set up.  

**How To Set up Restic & Restic Profile?**

_**Note: This example is for taking full system backup using `SFTP`. And This is tested on Debian based systems.**_

1. **Install Restic**  

    I used the following command to install restic on my workstation and personal machine. To get the latest version I am building it from the source.  

    If you are using Linux you can install it using your package manager. Details can be found [here](https://restic.readthedocs.io/en/latest/020_installation.html).

    - Clone the repository

        ```bash
        git clone https://github.com/restic/restic
        ```

    - Build the binary  
        Restic uses [Go](https://golang.org/) to build the binary. And It uses the latest version of Go

        ```bash
        cd restic && go run build.go
        ```

    - You check the build binary by running the following command

        ```bash
        prinzpiuz@prinzpiuz/tmp > restic version
        restic 0.17.1 compiled with go1.22.0 on linux/amd64
        ```

2. **Install Restic Profile**

    To Build From Source, We need Go, Git and Make installed.

    - Clone the repository

        ```bash
        git clone https://github.com/creativeprojects/resticprofile.git
        ```

    - Build the binary

        ```bash
        cd resticprofile
        make build
        ```

    - Install the binary to user path

        ```bash
        make install
        ```

    - You can check the build binary by running the following command

        ```bash
        prinzpiuz@prinzpiuz/tmp > resticprofile version  
        resticprofile version 0.28.1 commit 249fd41b3d8e1af034594c9617bc3145a6a3e29a
        ```

    Now We have restic and restic profile installed. Let's create a Location for our backup.

3. **Create Backup Location**

    I am using a network attached storage as my central repository. So I created a directory on my NAS and enabled SSH access to it, Key based authentication is enabled. If You want a separate user for restic, and you can follow this guide [here](https://restic.readthedocs.io/en/latest/080_examples.html#backing-up-your-system-without-running-restic-as-root)

4. **Create Restic Profile Configuration**

    You can create a restic profile configuration file in different formats like YAML, JSON, HCL and TOML. I am using TOML format.
    Also, I am managing my restic profile configuration in a git repository using [Chezmoi](https://www.chezmoi.io/). Directory structure of my restic profile configuration is as follows.

    ```bash
    prinzpiuz@prinzpiuz/tmp > tree -L 1 .
    .
    ├── exclude_files_list.txt
    ├── log
    ├── password.txt
    └── profiles.conf

    1 directory, 3 files
    ```

    Where
    - `exclude_files_list.txt` files and directories to exclude from backup.
    - `log` is a directory to store log files.
    - `password.txt` is a file to store password for restic.
    - `profiles.conf` is a configuration file for restic profile.

    A sample list of file & directories to exclude from backup is like [see here](https://github.com/prinzpiuz/dotfiles/blob/linux/debian12/private_dot_config/resticprofile/exclude_files_list.txt).  
    Also, Reasons for excluding these files and directories can be found [here](https://betterstack.com/community/questions/what-directories-on-linux-should-be-in-a-server-backup/#:~:text=%2Ftmp%20%2D%20The%20%2Ftmp%20directory,often%20be%20excluded%20from%20backups.)  
    A sample restic profile configuration can be seen [here](https://github.com/prinzpiuz/dotfiles/blob/linux/debian12/private_dot_config/resticprofile/profiles.conf).  
    A little explanation of different sections in my configuration file is as follows:

    - `global`:
        - `restic-binary`: Path to restic binary.
        - `ionice`: Option to prioritize restic process. [Read More Here](https://linux.die.net/man/1/ionice).
        - `log`: Path to log file.
    - `default`:
        - `base-dir`: Base directory of restic profile.
        - `repository`: Repository to store backup.
        - `password-file`: Path to password file.
    - `default-backup`: Options for restic `backup` command.
        - `dry-run`: Option to run restic `backup` command in dry-run mode.
        - `exclude-file`: Path to exclude file.
        - `tag`: Tag to identify backup.
        - `source`: Source directory to backup.
        - `schedule`: Schedule to run restic `backup` command.
        - `run-before`: Command to run before restic `backup` command.
        - `one-file-system`: Option to backup only one file system.
    - `default-check`: Options for restic `check` command.
    - `default-prune`: Options for restic `prune` command.

    You can find the explanation for each option in the configuration file [here](https://creativeprojects.github.io/resticprofile/configuration/index.html).

    I have scheduled my backup to run every day at 3:00 AM. Additionally, I will prune my backup every Sunday at 3:00 AM according to the retention policy. Furthermore, I have set up a check of my backup for the first day of every month at 2:00 AM.

    One thing you need to notice is here that I am using `one-file-system` option to backup as single file system. This option does a lot of the exclusions you’re trying to do manually. Any file system which isn’t specifically mounted as part of the root partition will be excluded, including virtual file systems. This means that virtual file systems like `/proc`, `/sys`, `/dev`, `/tmp`, and `/run` will be excluded automatically without the need for an exclude file or directive (So long as you specify the `one-file-system` directive.) However! If you’re backing up to somewhere on your root partition, you will need to exclude that manually!  
    More about this can be found [here](https://forum.restic.net/t/lack-of-documentation-on-how-to-do-a-full-system-back-up/659/7)

    Now we have restic and restic profile installed and a restic profile configuration file created. Let's create a backup.

5. **Initialize Restic Repository**

    To initialize a restic repository, we need to run the following command

    ```bash
    restic -r sftp:user@host:/srv/restic-repo init
    ```

    output will be like this

    ```bash
    enter password for new repository:
    enter password again:
    created restic repository f1c6108821 at sftp:user@host:/srv/restic-repo
    Please note that knowledge of your password is required to access the repository.
    Losing your password means that your data is irrecoverably lost.
    ```

    _**Note: Password you're using here is very important. If you forget your password, you will lose your data. So, please keep it safe.**_

    Also, more about restic backup using `SFTP` can be read [here](https://restic.readthedocs.io/en/latest/030_preparing_a_new_repo.html#sftp)

    A Sample directory structure of my restic repository is like this

    ```bash
    prinzpiuz@prinzpiuz > tree -d -L 2 /srv/Personal
    tree -d -L 2 .
    .
    ├── Personal
    │   ├── data
    │   ├── index
    │   ├── keys
    │   ├── locks
    │   └── snapshots

   ```

    Now we have a restic repository initialized. Let's create a backup.

6. **Test Backup**

    We can test the backup by running restic in dry mode, you can either dry from restic profile configuration using `--dry-run` or with the restic command directly.  
    I am using restic profile configuration file to do a dry run.
    The command will be like this

    ```bash
    resticprofile --config profiles.conf --name 'default' backup --dry-run
    ```

    This command will run the backup in dry mode with arguments specified in the restic profile default section.  
    And the output will be like this  

    ```bash
    using parent snapshot 56d1dc8c

    Files:         135 new,   709 changed, 1658843 unmodified
    Dirs:           30 new,   437 changed, 274573 unmodified
    Would add to the repository: 672.158 MiB (242.570 MiB stored)

    processed 1659687 files, 97.239 GiB in 0:52
    Applying Policy: keep 1 daily, 1 weekly, 1 monthly snapshots and all snapshots within 3h of the newest
    keep 1 snapshots:
    ID        Time                 Host        Tags         Reasons           Paths  Size
    -------------------------------------------------------------------------------------------

    56d1dc8c  2025-01-27 03:00:00  prinzpiuz   workstation  within 3h         /      97.234 GiB
                                                            daily snapshot
                                                            weekly snapshot
                                                            monthly snapshot
    -------------------------------------------------------------------------------------------

    1 snapshots
    ```

    Since I have previously created a backup, it will show the previous backup as parent.

7. **Create a Backup**

    Everything is working fine. Now we can create a backup.  
    To create a backup, we need to run the following command  

    ```bash
    resticprofile --config profiles.conf --name 'default' backup
    ```

    This command will run the backup with arguments specified in the restic profile default section.
    And will be taking little time  

8. **Scheduling Backup**

    One of the main reasons I chose to use a restic profile is for scheduling my backups. I utilize `systemd` to automate this scheduling. Additionally, the restic profile supports various other options, which you can explore further [here](https://creativeprojects.github.io/resticprofile/schedules/index.html)  

    A schedule a Backup we can use the following command

    ```bash
    resticprofile --config profiles.conf --name 'default' schedule
    ```

    To know the status of schedule backup we can use the following command

    ```bash
    resticprofile --config profiles.conf --name 'default' status
    ```

    This command will create [systemd/Timers](https://wiki.archlinux.org/title/Systemd/Timers) with arguments specified in the restic profile.

9. **Checking Backup**

    To ensure your backup is functioning correctly, you need to check it regularly.  
    One way to do this is by listing the backups stored in the repository. You can use the following command to list the backups in the repository.

    ```bash
    restic --verbose --repo sftp:user@host:/srv/restic-repo --password-file password.txt
    ```

    And the output will be like this

    ```bash
    repository 2294548e opened (version 2, compression level auto)

    ID        Time                 Host        Tags         Paths  Size
    -------------------------------------------------------------------------

    a7698e9c  2025-01-27 22:57:45  prinzpiuz   workstation  /      97.240 GiB
    -------------------------------------------------------------------------

    1 snapshots
    ```

{{< center >}}
 :tada: **You are now completely safe.** :tada:
{{< /center >}}

***

##### Docker Set Up

Now coming to how I am using restic with docker set up  
I am using Docker containers to host applications on my home server. The main issue I am facing is backing up my configuration files. I have set up a [script](https://github.com/prinzpiuz/Druv-Setup) to configure my server, so my primary concern is ensuring the safety of my config files.  
Instead of performing a full system backup, I am focusing on backing up only my configuration files.

{{< more yml "Here is the compose file" >}}
restic:
    image: mazzolino/restic
    container_name: restic
    hostname: restic_backup
    environment:
        - RUN_ON_STARTUP=true
        - BACKUP_CRON=0 _/12 * * *
        - RESTIC_REPOSITORY=${RESTIC_REPO}
        - RESTIC_PASSWORD=${RESTIC_PASSWORD}
        - RESTIC_BACKUP_SOURCES=/mnt/volumes
        - RESTIC_COMPRESSION=auto
        - RESTIC_BACKUP_ARGS=--tag media_server --exclude log._ --exclude _.log --exclude_.db --exclude logs --exclude _.db-shm --exclude_.db-wal --verbose
        - RESTIC_FORGET_ARGS=--keep-last 10 --keep-daily 7 --keep-weekly 5 --keep-monthly 12
        - TZ=Asia/Kolkata
    volumes:
        - /configs:/mnt/volumes:ro
        - /home/druv/.ssh:/run/secrets/.ssh:ro
    security_opt:
        - no-new-privileges:true
prune:
    image: mazzolino/restic
    container_name: restic_prune
    hostname: restic_backup
    restart: unless-stopped
    environment:
        - SKIP_INIT=true
        - RUN_ON_STARTUP=true
        - PRUNE_CRON=0 0 4 ***
        - RESTIC_REPOSITORY=${RESTIC_REPO}
        - RESTIC_PASSWORD=${RESTIC_PASSWORD}
        - TZ=Asia/Kolkata
    volumes:
        - /home/druv/.ssh:/run/secrets/.ssh:ro
check:
    image: mazzolino/restic
    container_name: restic_check
    hostname: restic_backup
    restart: unless-stopped
    environment:
        - SKIP_INIT=true
        - RUN_ON_STARTUP=false
        - CHECK_CRON=0 15 5***
        - RESTIC_CHECK_ARGS=--read-data-subset=10%
        - RESTIC_REPOSITORY=${RESTIC_REPO}
        - RESTIC_PASSWORD=${RESTIC_PASSWORD}
        - TZ=Asia/Kolkata
    volumes:
        - /home/druv/.ssh:/run/secrets/.ssh:ro
{{< /more >}}

***

##### Monitoring Backups

Imagine this situation: we have a complex backup setup, and one day we need to restore a backup from last month due to an emergency. However, the backups haven't been working correctly, leading to a crisis.

Monitoring is a crucial aspect of any backup strategy. Regardless of how robust our setup is, if an error occurs and backups are not functioning properly, it can lead to disastrous consequences.

I would like to introduce you to a tool called **[Backrest](https://github.com/garethgeorge/backrest)**. In my case, I use it to monitor whether backup schedules are running smoothly, to verify backups, and to prune old backups when storage space is limited.

While Restic offers commands to check backup statuses, running these commands manually every day can be tedious. Backrest acts as a web-based user interface for Restic. Although it has the capability to schedule backups, I primarily use it as a monitoring tool to oversee backup schedules, review backup reports, and manage backups in case of an emergency.

{{< more yml "Backrest Docker Setup I am Using" >}}
backrest:
    image: garethgeorge/backrest:latest
    container_name: backrest
    hostname: backrest
    volumes:
      - ./configs/backrest/data:/data
      - ./configs/backrest/config:/config
      - ./configs/backrest/cache:/cache
      - /media/prinzpiuz/backups:/repos
    environment:
      - BACKREST_DATA=/data # path for backrest data. restic binary and the database are placed here.
      - BACKREST_CONFIG=/config/config.json # path for the backrest config file.
      - XDG_CACHE_HOME=/cache # path for the restic cache which greatly improves performance.
      - TZ=Asia/Kolkata # set the timezone for the container, used as the timezone for cron jobs.
    ports:
      - 9898:9898
    restart: unless-stopped
    network_mode: host
{{< /more >}}

***

**Here are some helpful resources for further research**

- The 3-2-1 Backup Strategy
  - <https://www.backblaze.com/blog/the-3-2-1-backup-strategy/>
- Restic Reddit
  - <https://www.reddit.com/r/restic/>
- Restic Forum
  - <https://forum.restic.net/>
- Awesome Restic
  - <https://github.com/rubiojr/awesome-restic>
- My Home Server Set Up
  - <https://github.com/prinzpiuz/Druv-Setup/tree/main>
- My Restic and Restic Profile Setup
  - <https://github.com/prinzpiuz/dotfiles/blob/linux/debian12/private_dot_config/resticprofile/profiles.conf>
- Command alias I am using with restic
  - <https://github.com/prinzpiuz/dotfiles/blob/linux/debian12/dot_zshrc#L224>
