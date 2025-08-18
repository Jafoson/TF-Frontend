import Image from "next/image";
import styles from "./layout.module.scss";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className={styles.body}>
      <Image
        src="/logo/tf_logo_dark.svg"
        alt="logo"
        width={256}
        height={78}
        className={styles.logo}
      />
      <div className={styles.container}>{children}</div>
      <a
        href="https://www.flickr.com/photos/lolesports/52480129122/in/album-72177720303465298"
        target="_blank"
        className={styles.credit}
      >
        Photo by Colin Young-Wolff/Riot Games
      </a>
    </body>
  );
}
