#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod greeter {
    const MINIMUM_BID: Balance = 100000000;
    use ink::prelude::string::String;
    use ink::storage::Mapping;
    use ink::prelude::vec::Vec;
    #[ink(event)]
    pub struct Greeted {
        from: Option<AccountId>,
        message: String,
    }

    #[ink(storage)]
    pub struct Auction {
        product: String,
        current_owner: AccountId,
        price: Balance,
        current_bid: Balance,
        current_bidder: AccountId,
        sold: bool,
        bidder_list: Mapping<AccountId, Balance>,
        bidders: Vec<AccountId>,
    }

    impl Auction {
       
        #[ink(constructor)]
        pub fn new(init_value: String) -> Self {
            let bidder_list = Mapping::default();
            Self {
                product: init_value,
                current_owner: Self::env().caller(),
                price: 0,
                current_bid: MINIMUM_BID,
                current_bidder: Self::env().caller(),
                sold: false,
                bidder_list,
                bidders: Vec::new()
            }
        }

        #[ink(constructor)]
        pub fn default() -> Self {
            let default_message = String::from("Golden watch");
            Self::new(default_message)
        }

        #[ink(message)]
        pub fn product_name(&self) -> String {
            self.product.clone()
        }

        #[ink(message)]
        pub fn get_current_bidder(&self) ->  AccountId {
            self.current_bidder.clone()
        }

    

        #[ink(message)]
        pub fn get_current_owner(&self) ->  AccountId {
            self.current_owner.clone()
        }


        #[ink(message)]
        pub fn get_current_bid(&self) ->  Balance {
            self.current_bid.clone()
        }

        #[ink(message)]
        pub fn get_sold_status(&self) ->  bool {
            self.sold.clone()
        }

        #[ink(message)]
        pub fn get_all_bidders(&self) -> (Vec<AccountId>, Vec<Balance>) {
            let mut temp_bids:Vec<Balance> = Vec::new();
            for bidder in self.bidders.clone()  {
                temp_bids.push(self.bidder_list.get(bidder).unwrap())
            }
            (self.bidders.clone(), temp_bids)
        }


        #[ink(message, payable)]
        pub fn bid_product(&mut self) -> Result<(), Error> {
            assert_ne!(self.sold, true);
            assert_ne!(self.env().caller(), self.current_owner);
            let bidder = self.bidder_list.get(&self.env().caller());
            if bidder.is_some() {
                return Err(Error::InvalidSignature);
            }
            let bid_amount = self.env().transferred_value();
            if bid_amount > MINIMUM_BID {
                self.current_bid += bid_amount;
                self.current_bidder = self.env().caller();
                self.bidders.push(self.env().caller());
                self.bidder_list.insert(self.env().caller(), &bid_amount);
            } else {
                return Err(Error::AmountIsLessThanWithdrawn);
            }
            Ok(())
        }

        #[ink(message)]
        pub fn finalize_product(&mut self) -> Result<(), Error> {
            if self.env().caller() != self.current_owner {
                return Err(Error::CallerIsNotSender);
            }
            if !self.sold {
                self.price = self.current_bid;
                self.sold = true;
                self.current_owner = self.current_bidder;
            } else {
                return Err(Error::InvalidSignature);
            }
            Ok(())
        }

        #[ink(message)]
        pub fn take_back_money(&mut self) -> Result<(), Error> {
            if !self.sold {
                return Err(Error::NotYetExpired);
            }
            if self.env().caller() == self.current_bidder {
                return Err(Error::CallerIsNotRecipient);
            }
            let bid_amount = self.bidder_list.get(&self.env().caller());
            if let Some(bid_amount) = bid_amount {
                if bid_amount > 0 {
                    let back_bid_amount = self.env().transfer(self.env().caller(), bid_amount);
                    if back_bid_amount.is_ok() {
                        self.bidder_list.insert(self.env().caller(), &0);
                    } else {
                        return Err(Error::TransferFailed);
                    }
                    Ok(())
                } else {
                    return Err(Error::AmountIsLessThanWithdrawn);
                }
            } else {
                return Err(Error::InvalidSignature);
            }
        }
      
        #[ink(message)]
        pub fn set_product_name(&mut self, new_value: String)-> Result<(), Error> {
            self.product = new_value.clone();
            if self.env().caller() != self.current_owner
            {
                return Err(Error::CallerIsNotRecipient);
            }
            let from = self.env().caller();
            self.env().emit_event(Greeted {
                from: Some(from),
                message: new_value,
            });
            Ok(())
        }

        
    }
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(::scale_info::TypeInfo))]
    pub enum Error {
        CallerIsNotSender,
        CallerIsNotRecipient,
        AmountIsLessThanWithdrawn,
        TransferFailed,
        NotYetExpired,
        InvalidSignature,
    }
}
