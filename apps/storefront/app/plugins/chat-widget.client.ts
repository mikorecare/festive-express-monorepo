declare global {
  interface Window {
    ChatWidget?: {
      initChatWidget: (config: { agentId: string }) => void;
    };
  }
}

export default defineNuxtPlugin(() => {
  useHead({
    link: [
      {
        rel: "stylesheet",
        href: "https://embeddable-widgets.pages.dev/chat-widget.css",
      },
    ],
    script: [
      {
        src: "https://embeddable-widgets.pages.dev/chat-widget.umd.js",
        async: true,
        defer: true,
        onload: () => {
          if (window.ChatWidget?.initChatWidget) {
            window.ChatWidget.initChatWidget({
              agentId: "d97c2ca5-19fc-47c9-90fb-ee552735f8e9",
            });
          }

          const replaceIcon = () => {
            const widget = document.querySelector("#frontdesk-widget-root");
            if (!widget) return;

            const shadowRoot = (widget as any).shadowRoot;
            if (!shadowRoot) return;

            const headerIcon = shadowRoot.querySelector(
              ".frontdesk-header__icon",
            );
            if (!headerIcon) return;

            headerIcon.innerHTML = "";

            const svg = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg",
            );
            svg.setAttribute("width", "24");
            svg.setAttribute("height", "24");
            svg.setAttribute("viewBox", "0 0 122 125");
            svg.setAttribute("fill", "none");
            svg.style.width = "28px";
            svg.style.height = "28px";
            svg.innerHTML = `
              <g filter="url(#filter0_f_72_251)">
                <ellipse cx="60.8008" cy="62.3" rx="30" ry="31.5" fill="#F69320"/>
              </g>
              <path d="M61.8008 22.8H57.8008V30.8H61.8008V22.8Z" fill="#F69322"/>
              <path d="M27.8008 59.8H19.8008V63.8H27.8008V59.8Z" fill="#F69322"/>
              <path d="M99.8008 59.8H91.8008V63.8H99.8008V59.8Z" fill="#F69322"/>
              <path d="M32.3861 32.7687L29.8984 35.3232L35.6279 40.9027L38.1155 38.3481L32.3861 32.7687Z" fill="#F69322"/>
              <path d="M83.9739 83.0072L81.4863 85.5617L87.2158 91.1412L89.7034 88.5867L83.9739 83.0072Z" fill="#F69322"/>
              <path d="M87.2139 32.7665L81.4844 38.346L83.972 40.9005L89.7015 35.321L87.2139 32.7665Z" fill="#F69322"/>
              <path d="M35.6279 82.9997L29.8984 88.5792L32.3861 91.1337L38.1155 85.5542L35.6279 82.9997Z" fill="#F69322"/>
              <path d="M81.2706 75.7011C83.516 71.9418 84.8008 67.5522 84.8008 62.8647C84.8008 49.0169 73.6057 37.8 59.7996 37.8C45.9934 37.8 34.8008 49.0169 34.8008 62.8647C34.8008 67.8551 36.2611 72.5036 38.782 76.4144C39.0648 76.8541 39.3598 77.284 39.6694 77.7041C39.6694 77.7041 39.7108 77.7457 39.7669 77.8409C39.7693 77.8458 39.7742 77.8531 39.7791 77.858C39.9376 78.0754 40.1106 78.2928 40.2837 78.5078C40.3544 78.5933 40.4276 78.6934 40.4983 78.7936C40.4983 78.796 40.5032 78.7985 40.5056 78.8034C40.6592 78.9939 46.3616 86.0778 48.4533 95.3772C48.6606 96.3005 49.0433 97.1506 49.5602 97.8883C50.8035 99.6641 52.8319 100.8 55.1065 100.8H64.517C66.7916 100.8 68.82 99.6666 70.0633 97.8883C70.5802 97.1481 70.963 96.2981 71.1702 95.3723C73.1791 86.41 79.2886 78.5395 79.8712 77.7994L79.8761 77.7945C79.8761 77.7945 79.8761 77.7945 79.8786 77.7921C79.8859 77.7847 79.8907 77.7774 79.8956 77.7725C79.8932 77.7774 79.8907 77.7799 79.8859 77.7823C79.8859 77.7823 79.8883 77.7774 79.8907 77.775C80.3832 77.1081 80.8464 76.4144 81.2731 75.6987M53.3877 50.6487C48.7337 51.4059 45.7618 54.8062 45.9739 59.5988C46.1811 64.2546 38.9697 64.2277 38.7649 59.5988C38.4236 51.8896 43.8017 44.9303 51.4691 43.6845C56.0134 42.9468 57.9516 49.9061 53.3853 50.6487" fill="#F69322"/>
              <path d="M51.3419 43.8513C43.7835 45.0684 38.4795 51.8671 38.8159 59.3985C39.0178 63.9207 46.1268 63.9469 45.9225 59.3985C45.7134 54.7188 48.643 51.3946 53.2309 50.6573C57.7323 49.9318 55.8217 43.1306 51.3419 43.8537" fill="white"/>
              <path d="M67.4879 116.8H52.1161C51.852 116.8 51.7069 117.138 51.8687 117.372C52.3088 118.011 52.8297 118.544 53.4078 118.948C54.1904 119.494 55.0801 119.8 56.0197 119.8H63.5843C64.5239 119.8 65.4136 119.494 66.1962 118.948C66.7742 118.544 67.2952 118.011 67.7329 117.372C67.8946 117.138 67.7495 116.8 67.4855 116.8" fill="#1B305B"/>
              <path d="M70.0043 97.8H49.4126C48.5227 97.8 47.8008 98.5437 47.8008 99.4578V100.142C47.8008 100.948 48.3572 101.617 49.0984 101.768C49.1991 101.788 49.3047 101.8 49.4126 101.8H70.1913C70.2993 101.8 70.4048 101.79 70.5056 101.768C71.2443 101.617 71.8008 100.945 71.8008 100.142V99.653C71.8008 98.6301 70.9949 97.8025 70.0043 97.8025" fill="#1B305B"/>
              <path d="M71.0474 103.079C70.7778 102.904 70.4578 102.8 70.1101 102.8H49.494C49.1463 102.8 48.8263 102.901 48.5567 103.079C48.214 103.302 47.957 103.645 47.8537 104.048C47.8209 104.179 47.8008 104.318 47.8008 104.459V105.141C47.8008 105.786 48.1787 106.348 48.728 106.622C48.7935 106.654 48.8641 106.684 48.9372 106.709C49.111 106.77 49.2975 106.8 49.494 106.8H70.1101C70.3041 106.8 70.4931 106.768 70.6669 106.709C70.7375 106.686 70.8055 106.657 70.871 106.624C71.4228 106.35 71.8008 105.789 71.8008 105.141V104.459C71.8008 104.33 71.7857 104.202 71.7579 104.083C71.6597 103.668 71.4002 103.309 71.0474 103.079Z" fill="#1B305B"/>
              <path d="M69.6535 107.8H49.9481C48.7616 107.8 47.8008 108.697 47.8008 109.799C47.8008 110.901 48.7643 111.8 49.9481 111.8H69.6535C70.8399 111.8 71.8008 110.903 71.8008 109.799C71.8008 108.694 70.8373 107.8 69.6535 107.8Z" fill="#1B305B"/>
              <path d="M70.1973 113.082C69.9128 112.906 69.5522 112.8 69.1548 112.8H51.4492C51.0444 112.8 50.674 112.911 50.387 113.093C50.3306 113.128 50.2791 113.165 50.2301 113.206C49.9627 113.428 49.8008 113.721 49.8008 114.043V114.557C49.8008 115.244 50.5391 115.8 51.4492 115.8H68.9635C69.979 115.8 70.8008 115.177 70.8008 114.41V114.043C70.8008 113.721 70.6389 113.428 70.3715 113.206C70.3175 113.161 70.2587 113.119 70.1973 113.082Z" fill="#1B305B"/>
              <defs>
                <filter id="filter0_f_72_251" x="0.000782013" y="-1.14441e-05" width="121.6" height="124.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feGaussianBlur stdDeviation="15.4" result="effect1_foregroundBlur_72_251"/>
                </filter>
              </defs>
            `;

            headerIcon.appendChild(svg);
          };

          const injectStyles = () => {
            const widget = document.querySelector("#frontdesk-widget-root");
            if (widget) {
              const shadowRoot = (widget as any).shadowRoot;
              if (shadowRoot) {
                if (shadowRoot.querySelector("#custom-chat-styles")) {
                  replaceIcon(); // Still try to replace icon even if styles exist
                  return;
                }

                const style = document.createElement("style");
                style.id = "custom-chat-styles";
                style.textContent = `
                  /* ===== HIDE BANNER ===== */
                  .frontdesk-banner {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    height: 0 !important;
                    width: 0 !important;
                    overflow: hidden !important;
                    pointer-events: none !important;
                    position: absolute !important;
                    top: -9999px !important;
                    left: -9999px !important;
                  }

                  /* ===== CUSTOM WATERMARK ===== */
                  .frontdesk-watermark {
                    background: #1C2D5B !important;
                    padding: 8px 16px !important;
                    text-align: center !important;
                    border-top: 2px solid #F49321 !important;
                    text-decoration: none !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 8px !important;
                  }

                  .frontdesk-watermark-text-powered-by,
                  .frontdesk-watermark-text,
                  .frontdesk-watermark-text .blue {
                    display: none !important;
                  }

                  .frontdesk-watermark::after {
                    content: "Powered By: Festive Express" !important;
                    color: #ffffff !important;
                    font-size: 0.8rem !important;
                    font-weight: 600 !important;
                    letter-spacing: 0.5px !important;
                  }
                    
                  /* ===== CONTAINER ===== */
                  .frontdesk-container {
                    background: #ffffff !important;
                    border-radius: 16px !important;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
                    border: 1px solid rgba(12, 35, 64, 0.1) !important;
                    overflow: hidden !important;
                    width: 380px !important;
                    max-width: 90vw !important;
                  }

                  /* ===== HEADER ===== */
                  .frontdesk-header {
                    background: linear-gradient(135deg, #1C2D5B 0%, #1a3a6b 100%) !important;
                    padding: 16px 20px !important;
                    border-bottom: 3px solid #F49321 !important;
                  }

                  .frontdesk-header__title {
                    color: #ffffff !important;
                    font-size: 1.1rem !important;
                    font-weight: 700 !important;
                    font-family: 'Poppins', sans-serif !important;
                  }

                  .frontdesk-header__icon {
                   padding-bottom: 4px !important;
                    color: #F49321 !important;
                  }

                  .frontdesk-header__close {
                    color: #ffffff !important;
                    opacity: 0.7 !important;
                    transition: opacity 0.3s !important;
                  }

                  .frontdesk-header__close:hover {
                    opacity: 1 !important;
                  }

                  /* ===== CHAT HISTORY ===== */
                  .frontdesk-chat-history {
                    background: #f8f9fa !important;
                    padding: 16px !important;
                    max-height: auto !important;
                    overflow-y: auto !important;
                  }

                  /* ===== ACTIONS / BUTTONS ===== */
                  .frontdesk-actions {
                    padding: 16px !important;
                    background: #ffffff !important;
                    border-top: 1px solid #e2e8f0 !important;
                  }

                  .frontdesk-button--primary {
                    background: linear-gradient(180deg, #F49321 0%, #e07a0a 100%) !important;
                    color: #ffffff !important;
                    font-weight: 700 !important;
                    padding: 12px 24px !important;
                    border-radius: 50px !important;
                    border: none !important;
                    width: 100% !important;
                    font-family: 'Poppins', sans-serif !important;
                    transition: all 0.3s !important;
                    box-shadow: 0 4px 12px rgba(255, 137, 11, 0.3) !important;
                  }

                  .frontdesk-button--primary:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 20px rgba(255, 137, 11, 0.4) !important;
                    background: linear-gradient(180deg, #f57c00 0%, #d06800 100%) !important;
                  }

                  .frontdesk-button--primary:active {
                    transform: translateY(0px) !important;
                  }

                  .frontdesk-button__icon {
                    color: #ffffff !important;
                  }

                  /* ===== LAUNCHER BUTTON ===== */
                  .frontdesk-launcher__button {
                    background: linear-gradient(135deg, #1C2D5B 0%, #1a3a6b 100%) !important;
                    color: #ffffff !important;
                    width: 60px !important;
                    height: 60px !important;
                    border-radius: 50% !important;
                    box-shadow: 0 8px 24px rgba(12, 35, 64, 0.4) !important;
                    transition: all 0.3s !important;
                    border: 2px solid #F49321 !important;
                  }

                  .frontdesk-launcher__button:hover {
                    transform: scale(1.05) !important;
                    box-shadow: 0 12px 32px rgba(255, 137, 11, 0.4) !important;
                  }

                  .frontdesk-launcher__chat-icon {
                    color: #ffffff !important;
                  }

                  /* ===== MOBILE ===== */
                  @media (max-width: 700px) {
                    .frontdesk-container {
                      width: 100% !important;
                      max-width: 90vw !important;
                      border-radius: 16px 16px 0 0 !important;
                      bottom: 0 !important;
                      right: -20px !important;
                      max-height: 80vh !important;
                    }

                    .frontdesk-header {
                      padding: 14px 16px !important;
                    }

                    .frontdesk-header__title {
                      font-size: 1rem !important;
                    }

                    .frontdesk-chat-history {
                      max-height: 60vh !important;
                    }

                    .frontdesk-message--agent .frontdesk-message__content,
                    .frontdesk-message--user .frontdesk-message__content {
                      max-width: 90% !important;
                    }

                    .frontdesk-actions {
                      padding: 4px 12px !important;
                      margin: 0 !important;
                    }
                  }
                `;

                shadowRoot.appendChild(style);
                replaceIcon();

                const banner = shadowRoot.querySelector(".frontdesk-banner");
                if (banner) {
                  (banner as HTMLElement).style.cssText =
                    "display: none !important; visibility: hidden !important;";
                }
              }
            }
          };

          // Try multiple times
          setTimeout(injectStyles, 500);
          setTimeout(injectStyles, 1000);
          setTimeout(injectStyles, 1500);
          setTimeout(injectStyles, 2000);
          setTimeout(injectStyles, 3000);

          // Also run replaceIcon directly multiple times
          setTimeout(replaceIcon, 400);
          setTimeout(replaceIcon, 900);
          setTimeout(replaceIcon, 1400);
          setTimeout(replaceIcon, 1900);
          setTimeout(replaceIcon, 2900);

          const observer = new MutationObserver(() => {
            const widget = document.querySelector("#frontdesk-widget-root");
            if (widget) {
              const shadowRoot = (widget as any).shadowRoot;
              if (shadowRoot) {
                if (!shadowRoot.querySelector("#custom-chat-styles")) {
                  injectStyles();
                } else {
                  replaceIcon();
                }
              }
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true,
          });
        },
        onerror: (e) => {
          console.error("Failed to load chat widget:", e);
        },
      },
    ],
  });
});
