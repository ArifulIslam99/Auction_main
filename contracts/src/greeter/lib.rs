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
        /// Creates a new greeter contract initialized with the given value.
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

        /// Creates a new greeter contract initialized to 'Hello ink!'.
        #[ink(constructor)]
        pub fn default() -> Self {
            let default_message = String::from("Hello ink!");
            Self::new(default_message)
        }

        /// Returns the current value of `message`.
        #[ink(message)]
        pub fn product_name(&self) -> String {
            self.product.clone()
        }

        #[ink(message)]
        pub fn get_current_bidder(&self) ->  AccountId {
            self.current_bidder
        }

        /// Sets `message` to the given value.
        #[ink(message)]
        pub fn set_message(&mut self, new_value: String) {
            self.product = new_value.clone();

            let from = self.env().caller();
            self.env().emit_event(Greeted {
                from: Some(from),
                message: new_value,
            });
        }

         #[ink(message)]
        pub fn reverse_message(&mut self) {
            self.product = self.product.chars().rev().collect::<String>();
        }
    }

    
}
