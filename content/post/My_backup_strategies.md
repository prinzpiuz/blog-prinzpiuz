---
title: "My Backup Strategies"
date: 2025-01-25T20:06:15+05:30
draft: true
categories: [backup, restic, backup-strategies, backup-strategies-for-linux]
bloTils-like: false
audio: false
modified_date: false
---
This is my first blog post for 2025, and I'm glad I published it in January. This post covers my backup setup, including the tools I tried, what I'm currently using, and my strategies.  

**What is Backup?**

A backup is essentially a duplicate of your important data, created to ensure that you have access to it in the event of data loss or corruption in your primary storage.  

This protective measure is crucial for safeguarding your files, whether due to accidental deletion, hardware failure, or unexpected disasters. With a reliable backup, you can quickly restore your information and minimize disruptions to your work or personal life.  

**Why Back Up?**

The answer is simple: it helps you avoid losing valuable information. We recognize the importance of our data, and in modern times, an old saying from the Bible can be rephrased as,  

> _"And what do you benefit if you gain the whole world but lose your own **DATA**?"_

In my own experience, I have suffered the consequences of neglecting data backup, resulting in the loss of something important to me. I now deeply regret not recognizing the importance of data preservation. Today, I view backing up data as one of the essential practices of the 21st century.

**What To Back Up**  

In my opinion, your backup strategy should include the following considerations:

- Any data that you value personally
- Files you believe are important
- Items that would be difficult to reproduce
- Anything else you want to ensure is preserved

Here are some specific categories to consider:

- Photos & Videos
- Financial Documents
- Personnel Files
- Notes
- System Configurations
- Databases
- Code
- Docker
  - Persistent Volumes
  - Docker Images(Rare Case)
- Machines you working with

**Back Up Strategies**  
I have tried various backup strategies over the years, and I have found that there is no one-size-fits-all solution.
Backup strategies will vary for everyone and will typically include a combination of various options that are both effective and affordable. My approach reflects this diversity.  

Here are the strategies I have tried and currently use:  

- **Personnel files, Photos & Videos & Financial Documents**  
  - Since the early days of Google Drive and Dropbox, I have maintained free accounts with both services. Google Drive offers 15 GB of free storage, which I have utilized to back up photos and small videos. I even digitized old film photographs from my family's collection and stored them there, including highlights from my parent's wedding that were captured from an old cassette.
    As my collection has grown—especially after my marriage and the increase in the number of photos taken. I decided to upgrade to a paid plan on Google Drive.  
  - I am currently using Google Drive to back up my personnel files.  
  - For financial documents also, I use Google Drive.  
- **Notes**
  - For note-taking, I initially used Notion, but later I discovered a fantastic free software called [Obsidian](https://obsidian.md/). I'm using the non-subscribed version, which does not allow syncing between devices. However, I found an excellent plugin called [Remotely Save](https://github.com/remotely-save/remotely-save) that enables syncing to services like Dropbox and Google Drive. I have been using this plugin for a while and have found it to be reliable.
  - Additionally, I maintain a private Git repository hosted on GitHub for my notes. This helps me manage versioning and store configuration files effectively.  
- **System Configurations**
  - For system configurations, I use [Chezmoi](https://github.com/twpayne/chezmoi), which is an excellent open-source tool written in Go. It also utilizes GitHub at the backend.  
- **Databases**
  - I do not have any mission-critical databases to back up at the moment. If you do, I recommend backing them up as well.  
- **Code**
  - I use Git for code Versioning.
  - I rely on GitHub and GitLab for hosting code.  
- **Docker & Machines**
  - I use a combination of tools to back up my machines. I use [Restic](https://github.com/restic/restic) for backing up my Linux machines. This is a little big topic, so I will write a separate blog post about it. You can read about it [here](/post/my_backup_strategies_part2).
