	//进入网站时显示
	  window.onload = function() {
		// 获取当前时间
		function getCurrentTime() {
		  const now = new Date();
		  const hours = String(now.getHours()).padStart(2, '0');
		  const minutes = String(now.getMinutes()).padStart(2, '0');
		  return `${hours}:${minutes}`;
		}

		// 获取当前时间并显示在 Snackbar
		const currentTime = getCurrentTime();

		mdui.snackbar({
		  message: `<h3>欢迎来到白糖突然想到的主页<br>现在时间:${currentTime}</h3>`,
		  placement: 'top',
		  closeable: true
		});
	  };
    // 初始化随机主题
    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
    mdui.setColorScheme(getRandomColor());
    
    // 主题切换功能
    document.addEventListener('DOMContentLoaded', () => {
      const themeToggleBtn = document.getElementById('theme-toggle');
      
      function toggleTheme() {
        const isDark = document.body.classList.contains('mdui-theme-dark');
        const newTheme = isDark ? 'mdui-theme-light' : 'mdui-theme-dark';
        
        document.body.classList.remove('mdui-theme-light', 'mdui-theme-dark');
        document.body.classList.add(newTheme);
        
        updateButtonIcon(newTheme);
        localStorage.setItem('theme', newTheme);
        mdui.setColorScheme(newTheme === 'mdui-theme-dark' ? 'dark' : 'light');
      }
      
      function updateButtonIcon(theme) {
        const iconName = theme === 'mdui-theme-dark' ? 'dark_mode' : 'light_mode';
        themeToggleBtn.setAttribute('icon', iconName);
      }
      
      function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          document.body.classList.remove('mdui-theme-light', 'mdui-theme-dark');
          document.body.classList.add(savedTheme);
          updateButtonIcon(savedTheme);
          mdui.setColorScheme(savedTheme === 'mdui-theme-dark' ? 'dark' : 'light');
        }
      }
      
      themeToggleBtn.addEventListener('click', toggleTheme);
      initializeTheme();
    });
    
    // 导航功能
    document.addEventListener('DOMContentLoaded', () => {
      const navDialog = document.querySelector(".nav-loading-dialog");
      const navButtons = document.querySelectorAll(".open-nav");
      const cancelNavButton = navDialog?.querySelector(".cancel-navigation");
      const hitokotoText = document.getElementById("hitokoto_text");
      const loadingSubtitle = document.getElementById("loading_subtitle");
      let navigationTimer = null;
      let quoteLoaded = false;
	  
      // 一言功能
      if (hitokotoText) {
        const loadQuote = () => {
          if (quoteLoaded) return;
          
		  fetch('https://v1.hitokoto.cn')
			.then(response => response.json())
			.then(data => {
			  const hitokoto = document.querySelector('#hitokoto_text')
			  hitokoto.href = `https://hitokoto.cn/?uuid=${data.uuid}`
			  hitokoto.innerText = data.hitokoto
			})
            .catch(() => {
              hitokotoText.textContent = "加载句子失败，也许可以直接前往看看。";
              quoteLoaded = true;
            });
        };
        
        loadQuote();
        
        hitokotoText.addEventListener("click", () => {
          if (hitokotoText.dataset.uuid) {
            window.open(`https://hitokoto.cn/?uuid=${hitokotoText.dataset.uuid}`, "_blank");
          }
        });
        
        // 一言刷新功能
        const refreshtextBtn = document.getElementById('refreshtext');
        if (refreshtextBtn) {
          refreshtextBtn.addEventListener('click', function() {
            hitokotoText.textContent = "正在获取一句话...";
            quoteLoaded = false;
            loadQuote();
          });
        }
      }
	  
		// 导航按钮功能
		if (navDialog && navButtons.length > 0) {
		  navButtons.forEach((button) => {
			button.addEventListener("click", (event) => {
			  event.preventDefault();
			  const targetUrl = button.getAttribute("href") || button.getAttribute("data-target-url");
			  const subtitle = button.getAttribute("data-subtitle");
			  
			  if (!targetUrl) return;
			  
			  // 设置 subtitle
			  if (subtitle) {
				navDialog.setAttribute("description", subtitle);
			  }
			  
			  navDialog.open = true;
			  if (navigationTimer) {
				clearTimeout(navigationTimer);
			  }
			  
			  navigationTimer = setTimeout(() => {
				window.location.href = targetUrl;
			  }, 600);
			});
		  });
		}
      
      // 取消导航功能
      if (navDialog && cancelNavButton) {
        cancelNavButton.addEventListener("click", () => {
          navDialog.open = false;
          if (navigationTimer) {
            clearTimeout(navigationTimer);
            navigationTimer = null;
          }
        });
      }
      
      if (navDialog) {
        navDialog.addEventListener("close", () => {
          if (navigationTimer) {
            clearTimeout(navigationTimer);
            navigationTimer = null;
          }
        });
      }
      
      // 京剧猫同猫站弹窗功能
      const jjmBtn = document.querySelector('.jjm-open-btn');
      const jjmDialog = document.querySelector('.jjm-dialog');
      
      if (jjmBtn && jjmDialog) {
        jjmBtn.addEventListener('click', (event) => {
          event.preventDefault();
          jjmDialog.open = true;
        });
        
        // 添加取消按钮事件监听
        const jjmCancelBtn = document.querySelector('.jjm-cancel-btn');
        if (jjmCancelBtn) {
          jjmCancelBtn.addEventListener('click', () => {
            jjmDialog.open = false;
          });
        }
        
        const jjmDialogButtons = jjmDialog.querySelectorAll('mdui-button[data-target-url]');
        jjmDialogButtons.forEach(button => {
          button.addEventListener('click', () => {
            const targetUrl = button.getAttribute('data-target-url');
            if (targetUrl) {
              const navDialog = document.querySelector(".nav-loading-dialog");
              const subtitle = button.textContent.trim();
              if (navDialog && subtitle) {
                const loadingSubtitle = navDialog.querySelector('#loading_subtitle');
                if (loadingSubtitle) loadingSubtitle.textContent = `即将打开${subtitle}`;
                navDialog.open = true;
              }
              setTimeout(() => {
                window.location.href = targetUrl;
              }, 600);
            }
          });
        });
      }
      
      // 音乐播放控制
      const musicBtn = document.getElementById('play-music');
      const bgMusic = document.getElementById('bgMusic');
      let isPlaying = false;
      
      if (musicBtn && bgMusic) {
        musicBtn.addEventListener('click', function() {
          if (isPlaying) {
            // 暂停音乐
            bgMusic.pause();
            musicBtn.setAttribute('icon', 'play_arrow');
            musicBtn.textContent = '播放';
            isPlaying = false;
          } else {
            // 播放音乐
            bgMusic.play().then(() => {
              musicBtn.setAttribute('icon', 'pause');
              musicBtn.textContent = '暂停';
              isPlaying = true;
            }).catch(error => {
              console.error('播放音乐失败:', error);
            });
          }
        });
      }
    });
    
    // 运行时间计时器
    function updateSiteTime() {
      const startDate = new Date(2025, 9, 28); 
      const currentDate = new Date();
      
      const diffTime = Math.abs(currentDate - startDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);
      
      const years = Math.floor(diffDays / 365);
      const days = diffDays % 365;
      
      const siteTimeElement = document.getElementById('site-time');
      if (siteTimeElement) {
        siteTimeElement.textContent = 
          `${years}年 ${days}天 ${diffHours}小时 ${diffMinutes}分 ${diffSeconds}秒`;
      }
    }
    
    // 启动运行时间计时器
    setInterval(updateSiteTime, 1000);
    updateSiteTime();
    
    // 访客计数器
    document.addEventListener('DOMContentLoaded', function() {
      const countElement = document.getElementById('visitor-count');
      if (countElement) {
        fetch('update-count.php', {
          method: 'POST'
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(count => {
          countElement.textContent = count;
        })
        .catch(error => {
          console.error('Error fetching visitor count:', error);
          countElement.textContent = "加载中...";
        });
      }
    });