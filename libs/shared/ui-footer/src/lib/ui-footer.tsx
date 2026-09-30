import { SocialMediaButtons } from '@domo/ui-buttons';
function UiFooter() {
  return (
    <footer className="fixed inset-x-0 bottom-0 p-4 text-sm text-center text-dark-light bg-dark-hard">
      <p className="text-align: center pb-4"> Copyright &copy; {new Date().getFullYear()}&nbsp;Totaldata All Rights Reserved</p>
      <SocialMediaButtons description={""} />
    </footer>
  );
}
export { UiFooter };