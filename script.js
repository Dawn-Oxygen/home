// 定义颜色数组
const materialColors = [
  "#6750A4",
  "#7B1FA2",
  "#512DA8",
  "#303F9F",
  "#1976D2",
  "#0288D1",
  "#0097A7",
  "#00796B",
  "#00695C",
  "#2E7D32",
  "#388E3C",
  "#558B2F",
  "#AFB42B",
  "#FBC02D",
  "#FFA000",
  "#FFB300",
  "#5D4037",
  "#455A64",
  "#546E7A"
];

// 进入网站时显示欢迎信息
window.onload = function() {
  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const currentTime = getCurrentTime();

  mdui.snackbar({
    message: `<span style="font-size: 18px; line-height: 1.5;">欢迎来到白糖突然想到的主页<br>现在时间:${currentTime}</span>`,
    placement: 'top',
    closeable: true
  });
  
  // 加载保存的颜色或使用随机颜色
  const savedColor = localStorage.getItem("theme-color");
  const randomColor = materialColors[Math.floor(Math.random() * materialColors.length)];
  const initialColor = savedColor || randomColor;
  mdui.setColorScheme(initialColor);
};

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
    
    // 获取当前主题色
    const currentThemeColor = localStorage.getItem('theme-color') || materialColors[0];
    mdui.setColorScheme(currentThemeColor);
  }
  
  function updateButtonIcon(theme) {
    const iconName = theme === 'mdui-theme-dark' ? 'dark_mode' : 'light_mode';
    themeToggleBtn.setAttribute('icon', iconName);
  }
  
  function initializeTheme() {
    // 首先检查是否有保存的亮/暗主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.classList.remove('mdui-theme-light', 'mdui-theme-dark');
      document.body.classList.add(savedTheme);
      updateButtonIcon(savedTheme);
    }
    
    // 获取当前主题色
    const currentThemeColor = localStorage.getItem('theme-color') || materialColors[0];
    mdui.setColorScheme(currentThemeColor);
  }
  
  themeToggleBtn.addEventListener('click', toggleTheme);
  initializeTheme();
});

// 每日一言功能 
let quoteText, quoteAuthor, quoteRefresh, quoteCopy;

document.addEventListener('DOMContentLoaded', function() {
  quoteText = document.getElementById("card-quote-text");
  quoteAuthor = document.getElementById("card-quote-author");
  quoteRefresh = document.getElementById("btn-refresh-quote");
  quoteCopy = document.getElementById("btn-copy-quote");

  if (!quoteText || !quoteAuthor) {
    console.error("每日一言元素未找到");
    return;
  }
  fetchQuote();
  if (quoteRefresh) {
    quoteRefresh.addEventListener("click", fetchQuote);
  }
  
  if (quoteCopy) {
    quoteCopy.addEventListener("click", copyQuote);
  }
});

// 获取每日一言函数
const fetchQuote = () => {
  if (!quoteText || !quoteAuthor) return;
  
  console.log("正在获取每日一言...");
  quoteText.style.opacity = "0.5";
  
  const apiEndpoints = [
    "https://v1.hitokoto.cn",
    "https://international.v1.hitokoto.cn",
    "https://v1.hitokoto.cn?c=a&c=b&c=c&c=d&c=i"
  ];
  
  fetch(apiEndpoints[0])
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log("每日一言获取成功:", data);
      if (quoteText && quoteAuthor) {
        quoteText.textContent = data.hitokoto || data.sentence || "获取失败，请重试";
        let author = data.from || "未知";
        let fromWho = data.from_who || "";
        quoteAuthor.textContent = fromWho ? `${fromWho} «${author}»` : `«${author}»`;
        quoteText.style.opacity = "1";
      }
    })
    .catch(error => {
      console.error("API请求失败:", error);
      fetch(apiEndpoints[1])
        .then(res => res.json())
        .then(data => {
          if (quoteText && quoteAuthor) {
            quoteText.textContent = data.hitokoto || data.sentence || "生活原本沉闷，但跑起来就有风。";
            let author = data.from || "网络";
            let fromWho = data.from_who || "";
            quoteAuthor.textContent = fromWho ? `${fromWho} «${author}»` : `«${author}»`;
            quoteText.style.opacity = "1";
          }
        })
        .catch(() => {
          const fallbackQuotes = [
            { text: "道阻且长，行则将至。", author: "诗经" },
            { text: "心有猛虎，细嗅蔷薇。", author: "西格里夫·萨松" },
            { text: "既然选择了远方，便只顾风雨兼程。", author: "汪国真" },
            { text: "人生如逆旅，我亦是行人。", author: "苏轼" }
          ];
          
          const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
          if (quoteText && quoteAuthor) {
            quoteText.textContent = randomQuote.text;
            quoteAuthor.textContent = `«${randomQuote.author}»`;
            quoteText.style.opacity = "1";
          }
        });
    });
};

// 复制每日一言函数
const copyQuote = () => {
  if (!quoteText || !quoteAuthor) return;
  
  const text = `${quoteText.textContent} — ${quoteAuthor.textContent}`;
  navigator.clipboard.writeText(text).then(() => {
    mdui.snackbar({
      message: "一言已复制到剪贴板",
      placement: 'bottom', 
      closeable: true,
      timeout: 2000
    });
  }).catch(err => {
    console.error("复制失败:", err);
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      mdui.snackbar({
        message: "一言已复制到剪贴板",
        placement: 'bottom',
        closeable: true,
        timeout: 2000
      });
    } catch (e) {
      console.error("复制失败:", e);
    }
    document.body.removeChild(textArea);
  });
};

// 导航功能
document.addEventListener('DOMContentLoaded', () => {
  const navDialog = document.querySelector(".nav-loading-dialog");
  const navButtons = document.querySelectorAll(".open-nav");
  const cancelNavButton = navDialog?.querySelector(".cancel-navigation");
  let navigationTimer = null;
  
  if (navDialog && navButtons.length > 0) {
    navButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const targetUrl = button.getAttribute("href") || button.getAttribute("data-target-url");
        const subtitle = button.getAttribute("data-subtitle");
        
        if (!targetUrl) return;

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
            navDialog.setAttribute("description", `即将打开${subtitle}`);
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
        bgMusic.pause();
        musicBtn.setAttribute('icon', 'play_arrow');
        musicBtn.textContent = '播放';
        isPlaying = false;
      } else {
        bgMusic.play().then(() => {
          musicBtn.setAttribute('icon', 'pause');
          musicBtn.textContent = '暂停';
          isPlaying = true;
        }).catch(error => {
          console.error('播放音乐失败:', error);
          mdui.snackbar({
            message: "音乐播放失败，请检查浏览器设置",
            placement: 'bottom',
            closeable: true
          });
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

// 颜色选择器功能
document.addEventListener('DOMContentLoaded', function() {
  const colorPickerDialog = document.querySelector(".color-picker-dialog");
  const btnThemeColor = document.getElementById("btn-theme-color");
  const closeColorPickerBtn = document.querySelector(".close-color-picker");
  const resetColorPickerBtn = document.querySelector(".reset-color-picker");
  const colorGrid = document.querySelector(".color-grid");

  const savedColor = localStorage.getItem("theme-color");
  const initialColor = savedColor || materialColors[0];

  if (colorGrid) {
    materialColors.forEach(color => {
      const colorItem = document.createElement("div");
      colorItem.style.cssText = `
        width: 36px; 
        height: 36px; 
        border-radius: 50%; 
        background-color: ${color}; 
        cursor: pointer; 
        border: 2px solid transparent; 
        transition: transform 0.2s, border-color 0.2s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      `;
      colorItem.title = color;

      if (initialColor && color.toUpperCase() === initialColor.toUpperCase()) {
         colorItem.style.border = "2px solid rgb(var(--mdui-color-primary))";
         colorItem.style.transform = "scale(1.1)";
      }
      
      colorItem.addEventListener("click", () => {
        mdui.setColorScheme(color);
        localStorage.setItem("theme-color", color);
        
        Array.from(colorGrid.children).forEach(c => {
           c.style.border = "2px solid transparent";
           c.style.transform = "scale(1)";
        });
        colorItem.style.border = "2px solid rgb(var(--mdui-color-primary))";
        colorItem.style.transform = "scale(1.1)";

        setTimeout(() => {
          if (colorPickerDialog) colorPickerDialog.open = false;
        }, 200);
      });
      
      colorItem.addEventListener("mouseenter", () => {
         if (colorItem.style.borderColor === "transparent") colorItem.style.transform = "scale(1.1)";
      });
      colorItem.addEventListener("mouseleave", () => {
         if (colorItem.style.borderColor === "transparent") colorItem.style.transform = "scale(1)";
      });

      colorGrid.appendChild(colorItem);
    });
  }

  if (btnThemeColor && colorPickerDialog) {
    btnThemeColor.addEventListener("click", () => colorPickerDialog.open = true);
  }
  
  if (closeColorPickerBtn && colorPickerDialog) {
      closeColorPickerBtn.addEventListener("click", () => colorPickerDialog.open = false);
  }

  if (resetColorPickerBtn && colorPickerDialog) {
      resetColorPickerBtn.addEventListener("click", () => {
        localStorage.removeItem("theme-color");
        const defaultColor = materialColors[0];
        mdui.setColorScheme(defaultColor);
        
        if (colorGrid) {
            Array.from(colorGrid.children).forEach(c => {
                c.style.border = "2px solid transparent";
                c.style.transform = "scale(1)";
                if (c.title.toUpperCase() === defaultColor.toUpperCase()) {
                    c.style.border = "2px solid rgb(var(--mdui-color-primary))";
                }
            });
        }
        
        colorPickerDialog.open = false;
        
        const snackbar = document.querySelector(".app-snackbar");
        if(snackbar) {
             snackbar.textContent = "已恢复默认主题色配置 (随机模式将在下次加载生效)";
             snackbar.open = true;
        }
      });
  }

  const themeSelector = document.querySelector(".theme-selector");
  let currentTheme = "auto";

  const applyTheme = (theme) => {
    document.body.classList.remove("mdui-theme-auto", "mdui-theme-light", "mdui-theme-dark");
    if (theme === "dark") {
      document.body.classList.add("mdui-theme-dark");
    } else if (theme === "light") {
      document.body.classList.add("mdui-theme-light");
    } else {
      document.body.classList.add("mdui-theme-auto");
    }
  };

  const updateThemeSelector = (theme) => {
    if (themeSelector) {
      themeSelector.value = theme;

      const buttons = themeSelector.querySelectorAll("mdui-segmented-button");
      buttons.forEach(btn => {
        btn.selected = btn.value === theme;
      });
    }
  };

  let isInitialThemeLoad = true;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    currentTheme = savedTheme;
    applyTheme(currentTheme);
    requestAnimationFrame(() => {
      updateThemeSelector(currentTheme);
      setTimeout(() => isInitialThemeLoad = false, 300);
    });
  } else {
    requestAnimationFrame(() => {
      updateThemeSelector("auto");
      setTimeout(() => isInitialThemeLoad = false, 300);
    });
  }
});

setTimeout(() => {
  mdui.update();
}, 100);