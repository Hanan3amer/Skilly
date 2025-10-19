import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../Loading/Loading";
import transactionIcon from "../../assets/transaction.svg";
import { ToastContainer } from "react-toastify";

const TransactionCard = ({ userName, message, formattedCreatedAt }) => {
  const amountRegex = /(\d+[.,]?\d*)\s*([\u0621-\u064A.]+)?/;
  const match = message.match(amountRegex);
  let before = message;
  let amount = null;
  let currency = null;
  let after = null;
  if (match) {
    const idx = match.index;
    before = message.slice(0, idx);
    amount = match[1];
    currency = match[2] || "";
    after = message.slice(idx + match[0].length);
  }

  return (
    <div className="w-full bg-[#F6F7F9] rounded-xl p-4 flex flex-col gap-1 shadow-sm">
      <div className="flex justify-end flex-row-reverse items-center mb-1">
        <div className="flex items-center gap-3">
          <span className="font-bold mr-2 text-gray-900 text-base">
            {userName}
          </span>
        </div>
        <span className="bg-sky-400 rounded-lg flex items-center justify-center w-10 h-10">
          <img
            src={transactionIcon}
            alt="transaction icon"
            className="w-6 h-6 bg-white rounded-full p-[3px]"
          />
        </span>
      </div>
      <div
        dir="rtl"
        className="text-gray-700 text-sm text-right leading-relaxed"
      >
        {before}
        {amount && (
          <span className="text-sky-400 font-bold">
            {amount} {currency}
          </span>
        )}
        {after}
      </div>
      <div className="text-xs text-gray-300 text-left mt-1" dir="ltr">
        {formattedCreatedAt}
      </div>
    </div>
  );
};

TransactionCard.propTypes = {
  userName: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  formattedCreatedAt: PropTypes.string.isRequired,
};

function WithdrawModal({ open, onClose, balance, onSubmit, loading }) {
  const [method, setMethod] = useState("INSTAPAY");
  const [instapayEmail, setInstapayEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (method === "INSTAPAY") {
      if (!instapayEmail) {
        setSubmitError("يرجى إدخال عنوان الدفع");
        return;
      }
    }
    if (method === "محفظه") {
      if (!phoneNumber) {
        setSubmitError("يرجى إدخال رقم الهاتف");
        return;
      }
    }
    setSubmitting(true);
    try {
      await onSubmit({ withdrawMethod: method, phoneNumber, instapayEmail });
      onClose();
      setInstapayEmail("");
      setPhoneNumber("");
    } catch {
      setSubmitError("فشل السحب. تحقق من البيانات وحاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000053] bg-opacity-40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-[50%] max-w-[600px] min-w-[300px] p-0 relative">
        <div className="bg-sky-400 text-white text-xl font-bold text-center rounded-t-2xl py-3 tracking-wide relative">
          المحفظة
        </div>
        <div className="p-6 flex flex-col items-center">
          <div className="text-sky-400 font-bold text-lg mt-2 mb-1 text-center">
            رصيدك الحالي
          </div>
          <div className="text-black font-bold text-2xl mb-2 text-center">
            {balance !== null ? (
              `${balance ?? 0} EGP`
            ) : (
              <span className="text-gray-400 text-base">--</span>
            )}
          </div>
          <hr className="w-full border-gray-200 my-2" />
          <div className="text-sky-400 font-bold text-lg mb-2 text-center">
            السحب
          </div>
          <form
            className="w-full flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            <div className="flex w-full mb-4 gap-2 justify-center">
              <button
                type="button"
                onClick={() => setMethod("INSTAPAY")}
                className={`flex-1 py-2 rounded-lg font-bold transition-colors duration-150 ${
                  method === "INSTAPAY"
                    ? "bg-sky-400 text-white"
                    : "bg-white text-sky-400   border border-sky-400"
                }`}
              >
                INSTAPAY
              </button>
              <button
                type="button"
                onClick={() => setMethod("محفظه")}
                className={`flex-1 py-2 rounded-lg font-bold transition-colors duration-150 ${
                  method === "محفظه"
                    ? "bg-sky-400 text-white"
                    : "bg-white text-sky-400 border border-sky-400"
                }`}
              >
                محفظة
              </button>
            </div>
            {method === "INSTAPAY" && (
              <>
                <label className="block w-full text-right text-gray-700 text-sm mb-1 font-bold">
                  عنوان الدفع
                </label>
                <div className="w-full mb-3 relative">
                  <input
                    type="text"
                    value={instapayEmail}
                    onChange={(e) => {
                      setInstapayEmail(e.target.value);
                      setSubmitError("");
                    }}
                    className="w-full px-24 py-2 rounded-lg border-none pr-[100px] focus:outline-none focus:ring-2 focus:ring-sky-400 text-right bg-[#F6F7F9] placeholder-gray-400 font-bold text-gray-700"
                    style={{ direction: "rtl" }}
                  />
                  <span className="absolute right-4 top-1/2 border-l-2 border-gray-200 pl-1 -translate-y-1/2 text-gray-500 font-bold pointer-events-none select-none">
                    @instapay
                  </span>
                </div>
                <div className="text-center text-gray-400 my-2 font-bold">
                  أو
                </div>
                <label className="block w-full text-right text-gray-700 text-sm mb-1 font-bold">
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setSubmitError("");
                  }}
                  placeholder="رقم الهاتف"
                  className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-right bg-white placeholder-gray-400 font-bold"
                />
              </>
            )}
            {method === "محفظه" && (
              <>
                <label className="block w-full text-right text-gray-700 text-sm mb-1 font-bold">
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setSubmitError("");
                  }}
                  placeholder="رقم الهاتف"
                  className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-right bg-white placeholder-gray-400 font-bold"
                />
              </>
            )}
            {submitError && (
              <div className="text-red-500 text-sm mb-2">{submitError}</div>
            )}
            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-2 mt-2 rounded-lg bg-sky-400 text-white font-bold text-lg hover:bg-sky-500 transition-colors disabled:opacity-60 shadow-md"
            >
              {submitting || loading ? "..." : "سحب"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

WithdrawModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default function Transactions() {
  const [expandedView, setExpandedView] = useState(false);
  const [transactionsData, setTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [balance, setBalance] = useState(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");
        if (!token) {
          setError("يرجى تسجيل الدخول أولاً");
          setLoading(false);
          return;
        }
        const response = await axios.get(
          "https://skilly.runasp.net/api/Payment/get-all-Transactions-by-providerId",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && response.data.trans) {
          setTransactionsData(response.data.trans);
        } else {
          setTransactionsData([]);
        }
      } catch {
        setError("فشل في تحميل المعاملات");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (!withdrawOpen) return;
    const fetchBalance = async () => {
      try {
        setWithdrawLoading(true);
        const token = localStorage.getItem("userToken");
        const response = await axios.get(
          "https://skilly.runasp.net/api/Wallet/get-Balance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBalance(response.data.result?.balance ?? 0);
      } catch {
        setBalance(null);
      } finally {
        setWithdrawLoading(false);
      }
    };
    fetchBalance();
  }, [withdrawOpen]);

  const allGroups = transactionsData || [];
  const allTransactions = allGroups.flatMap((group) =>
    group.transactions.map((t) => ({ ...t, groupTitle: group.title }))
  );
  const displayedTransactions = expandedView
    ? allTransactions
    : allTransactions.slice(0, 6);

  const groupedDisplayed = {};
  displayedTransactions.forEach((t) => {
    if (!groupedDisplayed[t.groupTitle]) groupedDisplayed[t.groupTitle] = [];
    groupedDisplayed[t.groupTitle].push(t);
  });

  const showToggleButton = !loading && !error && allTransactions.length > 6;

  const handleWithdraw = async ({
    withdrawMethod,
    phoneNumber,
    instapayEmail,
  }) => {
    setWithdrawLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      await axios.post(
        "https://skilly.runasp.net/api/Wallet/apply-withdraw",
        {
          ...(withdrawMethod === "INSTAPAY" && {
            instapayEmail: instapayEmail
              ? `${instapayEmail}@instapay.com`
              : phoneNumber
              ? phoneNumber
              : undefined,
          }),
          ...(withdrawMethod === "محفظه" && {
            phoneNumber: phoneNumber ? phoneNumber : undefined,
          }),
          withdrawMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setWithdrawOpen(false);
      setShowSuccessModal(true);
    } catch {
      throw new Error();
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <section
      className="flex flex-col w-full text-gray-800  min-h-[300px]"
      id="transactions"
    >
      <ToastContainer position="top-right" />
      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        balance={balance}
        onSubmit={handleWithdraw}
        loading={withdrawLoading}
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-[400px] p-0 relative">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="text-black font-bold text-xl mb-4" dir="rtl">
                تم تقديم طلب السحب بنجاح
              </div>
              <div
                className="text-gray-600 text-sm mb-6 leading-relaxed"
                dir="rtl"
              >
                سيتم تنفيذ طلبك في مدة أقصاها 3<br />
                أيام من تاريخ الطلب
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 rounded-xl bg-sky-400 text-white font-bold text-lg hover:bg-sky-500 transition-colors"
              >
                حسناً
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6 mt-5">
        <button
          className="px-6 py-2.5 text-white bg-sky-500 rounded-lg font-medium hover:bg-sky-600 transition-colors text-sm shadow-md"
          onClick={() => setWithdrawOpen(true)}
        >
          السحب
        </button>
      </div>
      <div className="mt-2 w-full max-md:max-w-full">
        {loading ? (
          <div className="flex justify-center items-center w-full py-10">
            <Loading />
          </div>
        ) : error ? (
          <div className="w-full text-center py-6">
            <p className="text-red-500">{error}</p>
          </div>
        ) : allTransactions.length === 0 ? (
          <div className="w-full text-center py-6">
            <p className="text-gray-500 ">لا توجد معاملات حالياً</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 w-full">
            {Object.entries(groupedDisplayed).map(
              ([groupTitle, groupTransactions]) => (
                <div key={groupTitle} className="flex flex-col gap-4">
                  <div className="text-gray-400 font-bold text-base mb-1 text-right pr-2">
                    {groupTitle}
                  </div>
                  <div
                    className="grid grid-cols-2 gap-5 max-md:grid-cols-1 w-full justify-items-end"
                    dir="rtl"
                  >
                    {groupTransactions.map((transaction) => (
                      <TransactionCard
                        key={transaction.id}
                        userName={transaction.userName}
                        message={transaction.message}
                        formattedCreatedAt={transaction.formattedCreatedAt}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
      {showToggleButton && (
        <button
          onClick={() => setExpandedView((v) => !v)}
          className="flex gap-1 self-start mt-6 text-sm font-bold text-right text-black  max-md:mr-2.5 hover:text-sky-600  transition-colors items-center"
        >
          {expandedView ? (
            <span className="my-auto">عرض أقل ...</span>
          ) : (
            <span className="my-auto">عرض المزيد ...</span>
          )}
        </button>
      )}
    </section>
  );
}
