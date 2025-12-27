import NavigationDrawer from "@/components/layout/NavigationDrawer/NavigationDrawer";
import styles from "./layout.module.scss";
import TopBar from "@/components/layout/Topbar/TopBar/TopBar";



export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className={styles.body}>
      <div className={styles.container}>
          <NavigationDrawer/>
          <div className={styles.content}>
            <TopBar />
            {children}
          </div>
      </div>
    </body>
  );
}
