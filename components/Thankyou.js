import Title from "@components/Title";

const ThankYouBlock = ({ className, japaneseTitle, children }) => (
  <div className={`${className} thank-you-block`}>
    <Title
      title="Thank you for your inquiry"
      japanese={japaneseTitle || "お問い合わせありがとうございます"}
      className="static-title"
      positionClass="center"
    />
    <div className="inner-block">
      事務局にて確認し、ご登録のメールアドレスへお返事させていただきます。
      <br />
      お問い合わせ内容によって返信まで数日かかる場合がございます。ご了承ください。
      {children}
    </div>
  </div>
);

export default ThankYouBlock;
