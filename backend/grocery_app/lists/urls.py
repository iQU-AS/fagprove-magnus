from django.urls import path

from lists.views import CreateInviteLinkView, FinishShopping, GroceryListAPIView, JoinListWithTokenView, LeaveGroceryListAPIView, SingleGroceryListAPIView

lists_urls = [
    path(
        "api/single-grocery-list/<int:pk>/",
        SingleGroceryListAPIView.as_view(),
        name="single-grocery-list",
    ),
    path("api/grocery-lists/", GroceryListAPIView.as_view(), name="grocery-lists"),
    path(
        "api/grocery-lists/<int:pk>/",
        GroceryListAPIView.as_view(),
        name="grocery-lists",
    ),
    path(
        "api/grocery-lists/<int:pk>/leave/",
        LeaveGroceryListAPIView.as_view(),
        name="grocery-lists",
    ),
    path(
        "api/grocery-lists/<int:list_id>/invite/",
        CreateInviteLinkView.as_view(),
        name="create_invite",
    ),
    path(
        "api/join-list/<uuid:token>/",
        JoinListWithTokenView.as_view(),
        name="join_with_token",
    ),
    path(
        "api/grocery-lists/<int:list_id>/finish-shopping/",
        FinishShopping.as_view(),
        name="finish_shopping",
    ),
]
