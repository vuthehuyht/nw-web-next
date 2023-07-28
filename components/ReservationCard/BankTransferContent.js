import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const BankTransfer = () => (
  <Box className="bank-transfer">
    <Box className="bank-flow-info">
      <Typography variant="h5" align="center" className="title">
        【銀行振込の流れ】
      </Typography>
      <Typography variant="subtitle1" className="subtitle">
        ①下記の口座に銀行振込をする
      </Typography>
      <div className="flow-content">
        ※振込金額とは<span>予約内容の1番下に記載されている金額</span>です
      </div>
      <Typography variant="subtitle1" className="subtitle">
        ②下記のメールアドレスに「振込完了」を連絡
      </Typography>
      <div className="flow-content">
        <p>
          →メールアドレス：
          <a href="mailto:support@nailie.jp">support@nailie.jp</a>
        </p>
        <p>※お名前・お電話番号もご一緒にお送りください</p>
      </div>
      <Typography variant="subtitle1" className="subtitle">
        ③運営事務局で振込を確認
      </Typography>
      <div className="flow-content">
        ※振込の確認が終わるまでしばらくお待ちください
      </div>
    </Box>
    <Box className="bank-account-info">
      <Box display="flex" justifyContent="center">
        <Typography variant="subtitle1" className="title">
          振込先口座情報
        </Typography>
      </Box>
      <Box className="bank-account-content">
        <Table className="table" aria-label="simple table">
          <TableRow>
            <TableCell component="th">銀行名</TableCell>
            <TableCell align="right">三井住友銀行</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">支店名</TableCell>
            <TableCell align="right">三田通支店（623）</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">口座種別</TableCell>
            <TableCell align="right">普通口座</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">口座種別</TableCell>
            <TableCell align="right">8531402</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">口座名義</TableCell>
            <TableCell align="right">カ）ネイリー</TableCell>
          </TableRow>
        </Table>
      </Box>
    </Box>
    <Typography variant="subtitle1" className="note">
      手数料はご自身でご負担いただきます。また確認に2〜3営業日かかることがありますご了承ください。
    </Typography>
  </Box>
);

export default BankTransfer;
