import NavigationDrawer from "@/components/NavigationDrawer/NavigationDrawer";
import styles from "./layout.module.scss";
import "./layout.scss";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={styles.container}>
        <NavigationDrawer />
        <div className={styles.content}>{children}</div>
      </div>
    </>
  );
}
