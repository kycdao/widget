import styled from "styled-components"

export const AppStyleContainer = styled.div`
  font-size: 12px;

  --kyc-sdk-primary-font: neue-machina;
  --kyc-sdk-cybergreen: #00ffb3;
  --kyc-sdk-cybergreen-35: rgba(0, 255, 177, 0.35);
  --kyc-sdk-cybergreen-50: rgba(0, 255, 177, 0.5);
  --darken-green: #0af292;

  --kyc-sdk-normal-blue: #3a4be9;
  --kyc-sdk-dark-blue: #181f60;
  --kyc-sdk-dark-purple: #21114a;
  --kyc-sdk-green: #03f682;
  --kyc-sdk-green-darken: #0bcb77;
  --kyc-sdk-dark-green: #09b678;
  --kyc-sdk-cyberpunk: #72f9d1;
  --kyc-sdk-red: #ff4646;
  --kyc-sdk-red-darken: #d51f4f;

  --kyc-sdk-border: rgba(24, 31, 96, 0.05);
  --steps-padding: 2rem;
  --kyc-sdk-border-radius-full: 999rem;
  --kyc-sdk-border-radius-light: 5px;
  --kyc-sdk-inactive: #d7d9df;

  --kyc-sdk-button-height: 3rem;
  --kyc-sdk-header-height: 64px;
  --kyc-sdk-unit: 4.166666666666667vw;
  --kyc-sdk-connect-button-width: 19rem;

  --kyc-sdk-normal-blue-75: rgba(58, 75, 233, 0.75);
  --kyc-sdk-normal-blue-50: rgba(58, 75, 233, 0.5);
  --kyc-sdk-normal-blue-35: rgba(58, 75, 233, 0.35);
  --kyc-sdk-normal-blue-15: rgba(58, 75, 233, 0.15);

  --kyc-sdk-dark-blue-35: rgba(24, 31, 96, 0.35);
  --kyc-sdk-dark-blue-50: rgba(24, 31, 96, 0.5);
  --kyc-sdk-dark-blue-75: rgba(24, 31, 96, 0.75);

  --kyc-sdk-green-35: rgba(3, 246, 13, 0.35);
  --kyc-sdk-green-50: rgba(3, 246, 13, 0.5);
  --kyc-sdk-green-75: rgba(3, 246, 13, 0.75);

  --kyc-sdk-cyberpunk-15: rgba(144, 249, 209, 0.15);
  --kyc-sdk-cyberpunk-35: rgba(144, 249, 209, 0.35);
  --kyc-sdk-cyberpunk-50: rgba(144, 249, 209, 0.5);

  --kyc-sdk-red-35: rgba(255, 70, 70, 0.35);

  --light-font: gilroyLight;
  --display-font: gilroyBold;

  @font-face {
    font-family: gilroy-bold;
    font-style: normal;
    font-weight: 400;
    src: local("Gilroy-Bold"),
      url(https://fonts.cdnfonts.com/s/16219/Gilroy-Bold.woff) format("woff");
  }
  @font-face {
    font-family: gilroy-heavy;
    font-style: normal;
    font-weight: 400;
    src: local("Gilroy-Heavy"),
      url(https://fonts.cdnfonts.com/s/16219/Gilroy-Heavy.woff) format("woff");
  }
  @font-face {
    font-family: gilroy-light;
    font-style: normal;
    font-weight: 400;
    src: local("Gilroy-Light"),
      url(https://fonts.cdnfonts.com/s/16219/Gilroy-Light.woff) format("woff");
  }
  @font-face {
    font-family: gilroy-medium;
    font-style: normal;
    font-weight: 400;
    src: local("Gilroy-Medium"),
      url(https://fonts.cdnfonts.com/s/16219/Gilroy-Medium.woff) format("woff");
  }
  @font-face {
    font-family: gilroy-regular;
    font-style: normal;
    font-weight: 400;
    src: local("Gilroy-Regular"),
      url(https://fonts.cdnfonts.com/s/16219/Gilroy-Regular.woff) format("woff");
  }

  @font-face {
    font-family: itc avant garde gothic std book;
    font-style: normal;
    font-weight: 300;
    src: local("ITC Avant Garde Gothic Std Book"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-book-58957161d80eb.woff)
        format("woff");
  }
  @font-face {
    font-family: itc avant garde gothic std extra light;
    font-style: normal;
    font-weight: 275;
    src: local("ITC Avant Garde Gothic Std Extra Light"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-extra-light-5895708744eb6.woff)
        format("woff");
  }
  @font-face {
    font-family: itc avant garde gothic std extra light condensed;
    font-style: normal;
    font-weight: 275;
    src: local("ITC Avant Garde Gothic Std Extra Light Condensed"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-extra-light-condensed-589570b606f66.woff)
        format("woff");
  }
  @font-face {
    font-family: itc avant garde gothic std;
    font-style: italic;
    font-weight: 275;
    src: local("ITC Avant Garde Gothic Std"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-extra-light-oblique-5895712c301f0.woff)
        format("woff");
  }
  @font-face {
    font-family: itc avant garde gothic std book condensed;
    font-style: normal;
    font-weight: 300;
    src: local("ITC Avant Garde Gothic Std Book Condensed"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-book-condensed-5895704105b51.woff)
        format("woff");
  }
  @font-face {
    font-family: itc avant garde gothic std;
    font-style: italic;
    font-weight: 300;
    src: local("ITC Avant Garde Gothic Std"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-book-condensed-oblique-589570ed92a2c.woff)
        format("woff");
  }
  @font-face {
    font-family: itc avant garde gothic std;
    font-style: italic;
    font-weight: 300;
    src: local("ITC Avant Garde Gothic Std"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-book-oblique-589571c924212.woff)
        format("woff");
  }
  @font-face {
    font-family: itc avant garde gothic std medium condensed;
    font-style: normal;
    font-weight: 500;
    src: local("ITC Avant Garde Gothic Std Medium Condensed"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-medium-condensed-5895720edc668.woff)
        format("woff");
  }
  @font-face {
    font-family: itc avant garde gothic std demi;
    font-style: normal;
    font-weight: 600;
    src: local("ITC Avant Garde Gothic Std Demi"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-demi-589572a199962.woff)
        format("woff");
  }
  @font-face {
    font-family: itc avant garde gothic std demi condensed;
    font-style: normal;
    font-weight: 600;
    src: local("ITC Avant Garde Gothic Std Demi Condensed"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-demi-condensed-589571f095e47.woff)
        format("woff");
  }
  @font-face {
    font-family: itc avant garde gothic std;
    font-style: italic;
    font-weight: 600;
    src: local("ITC Avant Garde Gothic Std"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-demi-condensed-oblique-5895723d52f87.woff)
        format("woff");
  }
  @font-face {
    font-family: itc avant garde gothic std bold;
    font-style: normal;
    font-weight: 700;
    src: local("ITC Avant Garde Gothic Std Bold"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-bold-589572c7e9955.woff)
        format("woff");
  }
  @font-face {
    font-family: itc avant garde gothic std bold condensed;
    font-style: normal;
    font-weight: 700;
    src: local("ITC Avant Garde Gothic Std Bold Condensed"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-bold-condensed-5895705e8fe31.woff)
        format("woff");
  }
  @font-face {
    font-family: itc avant garde gothic std;
    font-style: italic;
    font-weight: 700;
    src: local("ITC Avant Garde Gothic Std"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-bold-condensed-oblique-5895710fb8537.woff)
        format("woff");
  }
  @font-face {
    font-family: itc avant garde gothic std;
    font-style: italic;
    font-weight: 700;
    src: local("ITC Avant Garde Gothic Std"),
      url(https://fonts.cdnfonts.com/s/14411/itc-avant-garde-gothic-std-bold-oblique-589573024abd6.woff)
        format("woff");
  }

  /* fallback */
  @font-face {
    font-family: Material Icons;
    font-style: normal;
    font-weight: 400;
    src: url(https://fonts.gstatic.com/s/materialicons/v139/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2)
      format("woff2");
    font-display: block;
  }

  .material-icons {
    font-family: Material Icons;
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    font-feature-settings: liga;
    -webkit-font-smoothing: antialiased;
  }
`
