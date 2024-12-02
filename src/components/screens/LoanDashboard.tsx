import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { databaseService } from "../../services/DatabaseService";

export function LoanDashboard({ navigation }) {
    const [activeLoans, setActiveLoans] = React.useState([]);

    React.useEffect(() => {
        loadActiveLoans();
    }, []);

    async function loadActiveLoans() {
        const loans = await databaseService.getActiveLoans();
        setActiveLoans(loans);
    }

    return (
        <scrollView>
            <flexboxLayout style={styles.container}>
                <label className="text-2xl font-bold mb-4">Active Loans</label>
                
                <button
                    className="bg-blue-500 text-white p-4 rounded-lg mb-4"
                    onTap={() => navigation.navigate("NewLoan")}
                >
                    Create New Loan
                </button>

                {activeLoans.map((loan) => (
                    <flexboxLayout
                        key={loan.id}
                        className="bg-white p-4 rounded-lg mb-4 w-full"
                        onTap={() => navigation.navigate("LoanDetails", { loanId: loan.id })}
                    >
                        <label className="text-lg font-semibold">
                            Client ID: {loan.clientId}
                        </label>
                        <label>Amount: ${loan.amount}</label>
                        <label>Next Payment: {new Date(loan.nextPaymentDate).toLocaleDateString()}</label>
                    </flexboxLayout>
                ))}
            </flexboxLayout>
        </scrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexDirection: "column",
    }
});